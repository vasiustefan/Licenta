import { useParams } from "react-router-dom";
const Tura = () => {
  const { id } = useParams();
  return <div>Tura id: {id}</div>;
};
export default Tura;
