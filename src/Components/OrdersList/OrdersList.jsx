import { getOrders, getSizes } from "../../Services/pizzaOrders";
import { useState, useEffect } from "react";
import { Spinner, Table, Alert, Container } from 'react-bootstrap';

const OrdersTable = ({ orders, sizes }) => {
    let formatDate = (dateString) => {
        const date = new Date(dateString)
        
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    return (
        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    <th>Order Name</th>
                    <th>Creation Date</th>
                    <th>Size</th>
                    <th>Toppings</th>
                    <th>Price</th>
                </tr>
            </thead>
            <tbody>
                {orders.map((order) => (
                    <tr key={order.id}>
                        <td>{order.name}</td>
                        <td>{formatDate(order.createdAt)}</td>
                        <td>{sizes[parseInt(order.size)]}</td>
                        <td>
                            <ul>
                                {order.toppingsList.map((topping, index) => (
                                    <li key={index}>{topping.name}</li>
                                ))}
                            </ul>
                        </td>
                        <td>{order.totalCost}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}
/* Container for toppings in various orders states */
const OrdersContainer = () => {
    const [orders, setOrders] = useState(
        {
            data: null,
            state: null
        }
    );

    const [sizes, setSizes] = useState(null);

    useEffect(() => {
        setOrders({ ...orders, state: "fetching" });

        getOrders()
            .then((responseO) => {
                getSizes()
                    .then((response) => {
                        setOrders({ data: responseO.data, state: "fetched" })
                        setSizes(response.data)
                    })
                    .catch((error) => setOrders({ ...orders, state: "failed" }))
            })
            .catch((error) => setOrders({ ...orders, state: "failed" }))

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (orders.state === 'fetching') {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" role="status" className="mb-3" />
                <div>Loading...</div>
            </Container>
        );
    } else if (orders.state === 'failed') {
        return (
            <Container className="text-center mt-5">
                <Alert variant="danger">Failed to fetch data.</Alert>
            </Container>
        );
    } else if (orders.state === 'fetched') {
        return (
            <div className="orders_success_container">
                <OrdersTable orders={orders.data} sizes={sizes} />
            </div>
        );
    }
};

export const OrdersList = () => {
    return (
        <div className="orders_wrap">
            <h2>Order list</h2>
            <OrdersContainer />
        </div>)
};