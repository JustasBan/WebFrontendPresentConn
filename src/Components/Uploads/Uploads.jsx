import { Order } from "./Order"
import { Toppings } from "./Toppings"
import { FetchProvider, useFetch } from "./FetchContext"
import { getToppings } from "../../Services/toppings";
import { getSizes } from "../../Services/pizzaOrders";
import { useEffect } from "react";
import { Container, Row, Col, Alert, Spinner } from 'react-bootstrap';

/* FetchContainer for toppings in various fetch states */
const FetchContainer = () => {
    const { fetch, setFetch } = useFetch();

    useEffect(() => {
        setFetch({ ...fetch, state: "fetching" });

        getToppings()
            .then((responseT) => {
                getSizes()
                    .then((responseS) => { setFetch({ toppings: responseT.data, state: "fetched", size: responseS.data }) })
                    .catch((error) => setFetch({ ...fetch, state: "failed" }));
            })
            .catch((error) => setFetch({ ...fetch, state: "failed" }))

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (fetch.state === 'fetching') {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" role="status" className="mb-3" />
                <div>Loading...</div>
            </Container>
        );
    } else if (fetch.state === 'failed') {
        return (
            <Container className="text-center mt-5">
                <Alert variant="danger">Failed to fetch data.</Alert>
            </Container>
        );
    } else if (fetch.state === 'fetched') {
        return (
            <Container>
                <Row>
                    <Col lg={9}>
                        <Order />
                    </Col>
                    <Col lg={3}>
                        <Toppings />
                    </Col>
                </Row>
            </Container>
        );
    }
};

export const Uploads = () => {

    return (
        <div>
            <FetchProvider>
                <FetchContainer />
            </FetchProvider>
        </div>
    )
}