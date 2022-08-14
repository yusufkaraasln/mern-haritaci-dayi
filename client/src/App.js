import * as React from "react";
import Map, { Popup, Marker } from "react-map-gl";
import "./App.css";
import "./popup.scss";
import axios from "axios";
import Login from "./components/login/Login";
import Register from "./components/register/Register";
function App() {
  const storage = JSON.parse(localStorage.getItem("view"));
  const userStorage = localStorage;

  const localUser = userStorage.getItem("user");

  const [viewState, setViewState] = React.useState({
    ...storage,
  });

  localStorage.setItem("view", JSON.stringify(viewState));

  const [currentUser, setCurrentUser] = React.useState(
    userStorage.getItem("user")
  );
  const [pins, setPins] = React.useState([]);
  const [currentPlaceId, setCurrentPlaceId] = React.useState(null);
  const [newPlace, setNewPlace] = React.useState(null);

  const [title, setTitle] = React.useState("");
  const [desc, setDesc] = React.useState("");
  const [rating, setRating] = React.useState(0);

  const [showLogin, setShowLogin] = React.useState(false);
  const [showRegister, setShowRegister] = React.useState(false);

  const handleLogout = () => {
    setCurrentUser(null);
    userStorage.removeItem("user");
  };

  const handleClick = (id, lat, long) => {
    setCurrentPlaceId(id);

    setViewState({
      ...viewState,
      latitude: lat,
      longitude: long,
    });
  };

  // React.useEffect(() => {
  //   navigator.geolocation.getCurrentPosition(
  //     (position) => {
  //       setViewState({
  //         longitude: position.coords.longitude,
  //         latitude: position.coords.latitude,
  //         zoom: 14,
  //       });
  //     },
  //     (err) => {
  //       console.log(err);
  //     }
  //   );
  // }, []);

  React.useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get("/pin");
        setPins(res.data);

        console.log(pins);
      } catch (error) {
        console.log(error);
      }
    };
    getPins();
  }, []);

  const addPopupClick = (e) => {
    setNewPlace({
      long: e.lngLat.lng,
      lat: e.lngLat.lat,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: localStorage.getItem("user"),
      title,
      desc,
      rating,
      lat: newPlace.lat,
      long: newPlace.long,
    };

    try {
      const res = axios.post("/pin", newPin);

      setPins([...pins, res.data]);
      setViewState({
        ...viewState,
        latitude: newPlace.lat,
        longitude: newPlace.long,
      });

      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Map
      {...viewState}
      onMove={(evt) => setViewState(evt.viewState)}
      style={{ width: "100vw", height: "100vh" }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      mapboxAccessToken={process.env.REACT_APP_MAP_TOKEN}
      onDblClick={addPopupClick}
    >
      {pins.map((pin, i) => (
        <div key={i} className="">
          <Marker longitude={pin.long} latitude={pin.lat}>
            <i
              onClick={() => handleClick(pin._id, pin.lat, pin.long)}
              style={{
                fontSize: viewState.zoom * 4,
                color: pin.username === localUser ? "red" : "black",
                cursor: "pointer",
              }}
              className="fa-solid fa-location-dot"
            ></i>
          </Marker>
          {currentPlaceId === pin._id && (
            <Popup
              longitude={pin.long}
              latitude={pin.lat}
              anchor="bottom"
              onClose={() => setCurrentPlaceId(null)}
              closeButton={true}
              closeOnClick={false}
            >
              <div className="card">
                <div className="card-content">
                  <span>
                    <strong>{pin.title}</strong>
                  </span>
                  <span>{pin.desc}</span>
                  <div className="card-content-stars">
                    {Array(pin.rating).fill(<i class="fa-solid fa-star"></i>)}
                  </div>
                </div>
                <div className="card-info">
                  <span>{pin.username}</span>
                  <p>{pin.createdAt}</p>
                </div>
              </div>
            </Popup>
          )}
        </div>
      ))}

      {newPlace && (
        <Popup
          longitude={newPlace.long}
          latitude={newPlace.lat}
          anchor="bottom"
          onClose={() => setCurrentPlaceId(null)}
          closeButton={true}
          closeOnClick={false}
        >
          <form action="" onSubmit={handleSubmit}>
            <div className="card">
              <div className="card-content">
                <input
                  type="text"
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Title"
                />
                <textarea
                  type="text"
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Description"
                />
                <div className="card-content-stars">
                  <select onChange={(e) => setRating(e.target.value)}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                  <button>Add a pin</button>
                </div>
              </div>
            </div>
          </form>
        </Popup>
      )}

      {currentUser ? (
        <button onClick={handleLogout} className="btn logout">
          Logout
        </button>
      ) : (
        <div className="btn">
          <button onClick={() => setShowLogin(true)} className="btn-login">
            Login
          </button>
          <button
            onClick={() => setShowRegister(true)}
            className="btn-register"
          >
            Register
          </button>
        </div>
      )}

      {showLogin && (
        <Login
          setShowLogin={setShowLogin}
          userStorage={userStorage}
          setCurrentUser={setCurrentUser}
        />
      )}
      {showRegister && <Register setShowRegister={setShowRegister} />}
    </Map>
  );
}
export default App;
