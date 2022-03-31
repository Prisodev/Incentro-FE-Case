import { useHistory } from "react-router-dom";
import "./End.css";

export default function End() {
  const history = useHistory();

  const clickHandle = () => {
    history.push("/");
  };

  return (
    <>
      <div className='endgame' onClick={() => clickHandle()}>
        <p className='large'>Helaas tijd was op!</p>
        <br />
        <p className='small'>Klik om opnieuw te beleven!</p>
      </div>
    </>
  );
}
