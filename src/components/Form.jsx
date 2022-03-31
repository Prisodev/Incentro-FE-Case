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

  const { data: address, isPending, error, setError } = useFetch(url, "GET");

  useEffect(() => {
    const elem = document.getElementById("adres");
    if (huisnummer && postcode.length >= 6) {
      setUrl(
        `https://geodata.nationaalgeoregister.nl/locatieserver/v3/suggest?q=${postcode} ${huisnummer}`
      );

      if (address) {
        try {
          if (address.response.numFound >= 1) {
            const id = address.response.docs[0].id;
            const bestResult = address.highlighting[id].suggest[0];
            var straat = bestResult
              .substring(0, bestResult.indexOf(" <b>"))
              .replace(",", "");
            var plaats = bestResult
              .substring(bestResult.indexOf("</b> ") + 5, bestResult.length)
              .replace(",", "");

            if (straat.indexOf("<") === -1) {
              elem.classList.remove("hidden");
              setStraatnaam(straat);
            } else {
              throw new Error("Fout in straatnaam");
            }

            if (plaats.indexOf("<") === -1) {
              setWoonplaats(plaats);
            } else {
              throw new Error("Fout in woonplaats");
            }
          } else {
            throw new Error("Geen adres gevonden");
          }
        } catch (error) {
          setStraatnaam("");
          setWoonplaats("");
          elem.classList.add("hidden");
          console.log(error.message);
        }
      }
    } else {
      elem.classList.add("hidden");
      setStraatnaam("");
      setWoonplaats("");
    }
  }, [huisnummer, postcode, address, url]);

  const btn = document.getElementById("btn");

  useEffect(() => {
    var filter = /^([a-zA-Z0-9.-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (email.length >= 1) {
      if (!filter.test(email)) {
        btn.setAttribute("disabled", true);
      } else {
        btn.removeAttribute("disabled");
      }
    }
  }, [email, setError, btn]);

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
                required
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
              required
              onChange={(e) => setAchternaam(e.target.value)}
              value={achternaam}
            />
          </label>
          <div className='flex'>
            <label>
              <span>Postcode:</span>
              <input
                type='text'
                required
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
                required
                onChange={(e) => {
                  sethuisnummer(
                    e.target.value.replace(/\s+|\W+|[-_]/g, "").toUpperCase()
                  );
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
                required
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
                required
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
              required
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </label>
          {!isPending && (
            <>
              <button className='btn' id='btn' disabled>
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
