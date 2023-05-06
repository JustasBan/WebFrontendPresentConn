import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { OrderProvider, useOrder } from "./OrderContext";
import { useFetch } from "./FetchContext";
import { getEstimate, postOrder } from "../../Services/pizzaOrders";
import { Container, Row, Col, Card, Dropdown, DropdownButton, Form, Button, ListGroup, ListGroupItem, Alert } from 'react-bootstrap';

const OrderCreator = () => {
    const { fetch } = useFetch();
    const { order, setOrder } = useOrder();

    //size handling:
    const [selectedOption1, setSelectedOption1] = useState("0");

    const handleChangeSize = (event) => {
        let selectedValue = event;
        setSelectedOption1(selectedValue)
    };

    const handleAddSize = (event) => {
        if (selectedOption1 !== "-1")
            setOrder({ ...order, size: selectedOption1 });

        event.preventDefault()
    }

    //toppings handling:
    const [selectedOption2, setSelectedOption2] = useState(null);

    useEffect(() => {
        if (fetch.toppings[0] !== undefined) {
            setSelectedOption2(fetch.toppings[0].id)
        }
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetch]);

    const handleChangeTopping = (event) => {
        let selectedValue = event;

        if (selectedValue !== "")
            setSelectedOption2(selectedValue);
    };

    const handleAddTopping = async (event) => {
        event.preventDefault()
        let new_tops = order.toppings

        if (selectedOption2 !== null) {
            new_tops.push(selectedOption2)
        }
        setOrder({ ...order, toppings: new_tops })
    }

    return (
        <Card className="mb-4">
            <Card.Header>
                <h3>Order Creation Tool</h3>
            </Card.Header>
            <Card.Body>
                <div className="d-flex align-items-center mb-4">
                    <span className="mr-3"><b>Size:</b></span>
                    <DropdownButton
                        id="dropdown-size-selector"
                        title={fetch.size[selectedOption1]}
                        onSelect={handleChangeSize}
                        size="sm"
                        className="small-dropdown"
                    >
                        {fetch.size.map((option, index) => (
                            <Dropdown.Item key={index} eventKey={index} className="small-dropdown-item">
                                {option}
                            </Dropdown.Item>
                        ))}
                    </DropdownButton>
                    <Button className="ml-3" onClick={handleAddSize} size="sm">
                        Select size
                    </Button>
                </div>

                <div className="d-flex align-items-center mb-4">
                    <span className="mr-3"><b>Topping:</b></span>
                    <DropdownButton
                        id="dropdown-size-selector"
                        title={selectedOption2 !== null && fetch.toppings.filter((p) => p.id===parseInt(selectedOption2))[0].name}
                        onSelect={handleChangeTopping}
                        size="sm"
                        className="small-dropdown"
                    >
                        {fetch.toppings.map((option) => (
                            <Dropdown.Item key={option.id} eventKey={option.id} className="small-dropdown-item">
                                {option.name}
                            </Dropdown.Item>
                        ))}
                    </DropdownButton>
                    <Button className="ml-3" onClick={handleAddTopping} size="sm">
                        Add topping
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
}

const PriceEstimation = () => {
    const { fetch } = useFetch();
    const { order, setOrder } = useOrder();
    const [price, setPrice] = useState(0);

    let handleRemove = (index) => {
        let changed = order.toppings
        changed.splice(index, 1)

        setOrder({ ...order, toppings: changed })
    }

    useEffect(() => {
        getEstimate(order.size, order.toppings)
            .then((response) => (setPrice(response.data)))
            .catch((error) => setPrice("Error in calculation"))

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [order]);

    return (
        <Card className="mb-4">
            <Card.Header>
                <h3>Price Calculator</h3>
            </Card.Header>
            <Card.Body>
                <ListGroup>
                    <ListGroupItem>
                        <b>Size: </b>{fetch.size[order.size]}
                    </ListGroupItem>
                    <ListGroupItem>
                        <b>Toppings:</b>
                        {order.toppings.length === 0 && <div>No toppings selected</div>}
                        {order.toppings.length > 0 && order.toppings.map((topping, index) => (
                            <div key={index} className="d-flex justify-content-between align-items-center toppings">
                                <div>{fetch.toppings[parseInt(topping) - 1].name}</div>
                                <Button variant="danger" size="sm" onClick={() => handleRemove(index)}>
                                    Remove
                                </Button>
                            </div>
                        ))}
                    </ListGroupItem>
                    <ListGroupItem>
                        <b>Price: </b>{price}
                    </ListGroupItem>
                </ListGroup>
            </Card.Body>
        </Card>
    );
}

const OrderSubmit = () => {
    const { order } = useOrder();
    const [data, setData] = useState(
        {
            name: "",
            state: ""
        }
    );

    const handleSubmit = async (event) => {
        event.preventDefault()

        setData({ ...data, state: "uploading" })

        postOrder(parseInt(order.size), order.toppings, data.name)
            .then((response) => {
                setData({ name: "", state: "success" })
            })
            .catch((error) => {
                setData({ ...data, state: "failed" })
                console.log(order);
            })
    }

    //disable upload button while uploading, to prevent spamming
    const isFormDisabled = data.state === 'uploading';

    return (
        <Card className="mb-4">
            <Card.Header>
                <h3>Submit Order</h3>
            </Card.Header>
            <Card.Body>
                {order.toppings.length === 0 && (
                    <Alert variant="warning">Order must have at least one topping</Alert>
                )}
                {order.size === '3' && (
                    <Alert variant="warning">Order must have a size</Alert>
                )}
                {data.state === 'failed' && (
                    <Alert variant="danger">Error in order upload</Alert>
                )}
                {data.state === 'uploading' && (
                    <Alert variant="info">Uploading...</Alert>
                )}
                {data.state === 'success' && (
                    <Alert variant="success">Upload successful!</Alert>
                )}

                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="orderName">
                        <Form.Label>
                            <b>Order name:</b>
                        </Form.Label>
                        <Form.Control
                            required
                            type="text"
                            value={data.name}
                            disabled={isFormDisabled}
                            onChange={(e) =>
                                setData({ ...data, name: e.target.value })
                            }
                        />
                    </Form.Group>
                    <Button
                        className="uploadButton"
                        type="submit"
                        disabled={isFormDisabled}
                    >
                        Upload order
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
}

export const Order = () => {
    return (
        <div>
            <h2>Order upload</h2>
            <OrderProvider>
                <Container>
                    <Row>
                        <Col lg={5}>
                            <OrderCreator />
                        </Col>
                        <Col lg={4}>
                            <PriceEstimation />
                        </Col>
                        <Col lg={3}>
                            <OrderSubmit />
                        </Col>
                    </Row>
                </Container>
            </OrderProvider>
            <h2>Order list</h2>
            <p>
                <Link to={`/ordersList`}>Go to orders list</Link>
            </p>
        </div>
    );
};