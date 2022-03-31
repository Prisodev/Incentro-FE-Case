import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import "./Form.css";

export default function Form() {
  const history = useHistory();
  const [voorletters, setVoorletters] = useState("");
  const [tussenVoegsel, setTussenVoegsel] = useState("");
  const [achternaam, setAchternaam] = useState("");
  const [postcode, setPostcode] = useState("");
  const [huisnummer, sethuisnummer] = useState("");

  const [straatnaam, setStraatnaam] = useState("");
  const [woonplaats, setWoonplaats] = useState("");
  const [email, setEmail] = useState("");
  const [url, setUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    history.push("/submit");
  };

  const { data: address, isPending, error } = useFetch(url, { type: "GET" });

  useEffect(() => {
    const elem = document.getElementById("adres");
    if (huisnummer && postcode.length >= 6) {
      console.log(huisnummer, url);
      setUrl(
        `https://api.overheid.io/bag?filters[postcode]=${postcode}&filters[huisnummer]=${huisnummer}&ovio-api-key=e18325ebed032f64528f56eedb3b84d94a91d17594d62229b9ae2fda7dc2dbfa`
      );
      console.log(typeof address, address);

      if (address) {
        try {
          elem.classList.remove("hidden");
          setStraatnaam(address._embedded.adres[0].openbareruimte);
          setWoonplaats(address._embedded.adres[0].woonplaats);
        } catch (error) {
          setStraatnaam("");
          setWoonplaats("");
          elem.classList.add("hidden");
          console.log("no address found");
        }
      }
    } else {
      elem.classList.add("hidden");
      setStraatnaam("");
      setWoonplaats("");
    }
  }, [huisnummer, postcode, address, url]);

  useEffect(() => {
    var filter = /^([a-zA-Z0-9.-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    const elem = document.getElementById("email");
    const btn = document.getElementById("submit");

    if (email.length >= 1) {
      if (!filter.test(email)) {
        btn.classList.add("hidden");
      } else {
        btn.classList.remove("hidden");
      }
    } else {
      elem.classList.remove("error");
      elem.classList.remove("valid");
    }
  }, [email]);

  return (
    <>
      <div id='overlay'>
        <div className='incentro'>
          <span className='fas fa-puzzle-empty incentrologo'></span>
        </div>
      </div>
      <div className='container'>
        <form onSubmit={handleSubmit} className={"login-form"}>
          <div className='flex'>
            <label>
              <span>Voorletter(s):</span>
              <input
                type='text'
                onChange={(e) => setVoorletters(e.target.value)}
                value={voorletters}
              />
            </label>
            <label>
              <span>Tussenvoegsel:</span>
              <input
                type='text'
                onChange={(e) => setTussenVoegsel(e.target.value)}
                value={tussenVoegsel}
              />
            </label>
          </div>
          <label>
            <span>Achternaam:</span>
            <input
              type='text'
              onChange={(e) => setAchternaam(e.target.value)}
              value={achternaam}
            />
          </label>
          <div className='flex'>
            <label>
              <span>Postcode:</span>
              <input
                type='text'
                onChange={(e) => {
                  setPostcode(
                    e.target.value.replace(/\s+|\W+|[-_]/g, "").toUpperCase()
                  );
                }}
                value={postcode}
                maxLength='6'
              />
            </label>
            <label>
              <span>Huisnummer:</span>
              <input
                type='text'
                onChange={(e) => {
                  sethuisnummer(e.target.value);
                }}
                value={huisnummer}
              />
            </label>
          </div>
          <span id='adres' className='hidden'>
            <label>
              <span>Straatnaam:</span>
              <input
                type='text'
                onChange={(e) => {
                  setStraatnaam(e.target.value);
                }}
                value={straatnaam}
                disabled
              />
            </label>
            <label>
              <span>Woonplaats:</span>
              <input
                type='text'
                onChange={(e) => {
                  setWoonplaats(e.target.value);
                }}
                value={woonplaats}
                disabled
              />
            </label>
          </span>

          <label>
            <span>Email:</span>
            <input
              id='email'
              type='email'
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </label>
          {!isPending && (
            <>
              <button className='btn hidden' id='submit'>
                Inschrijven
              </button>
            </>
          )}
          {isPending && <p>loading</p>}
          {error && <p>{error}</p>}
        </form>
      </div>
    </>
  );
}
