import moment from "moment";
import { Card } from "react-bootstrap";

const CardRiwayatAbsen = ({ data, fromChildToParentCallback, title }) => (
    data.map((x, index) => {
        return (
            <Card onClick={() => fromChildToParentCallback(index)} key={index} className="card-riwayat-absen">
                {/* <Card.Img variant="top" src={x.image} /> */}
                <Card.Body className="container-img-riwayat">
                    <img src={x.name_image_in} alt="img in" className="imageOne"/>
                    {x.imageOut && <img src={x.name_image_out} alt="img out" className="imageTwo"/>}
                </Card.Body>
                <Card.Body className="tes-text-riwayat">
                    <Card.Title>{moment(x.dateHadir).format('dddd, Do MMMM YYYY')}</Card.Title>
                    <Card.Text>{moment(x.dateHadir).format('h:mm:ss A')}</Card.Text>
                </Card.Body>
            </Card>
            // <>
            //     <div className="container-img-riwayat">
            //         <img src={x.imageIn} alt="img in" className="imageOne"/>
            //         <hr className="separator-riwayat"/>
            //     </div>
            // </>
        )
    })
);
export default CardRiwayatAbsen;