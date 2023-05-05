import { getOrders, getSizes } from "../../Services/pizzaOrders";
import { useState, useEffect } from "react";

/* Container for toppings in various orders states */
const Container = () => {
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

    if (orders.state === "fetching") {
        return <div className="orders_loading_container"><i>Loading orders...</i></div>;
    } else if (orders.state === "failed") {
        return <div className="orders_failed_container"><i>Failed to load orders data.</i></div>
    } else if (orders.state === "fetched") {
        return (
            <div className="orders_success_container">
                <i>Successfuly loaded orders</i>
                {orders.data.map((order) => (
                    <div key={order.id}>
                        <p><b>{order.name} </b> {order.createdAt} {sizes[parseInt(order.size)]} {order.totalCost}</p>
                        <ul>
                            {order.toppingsList.map((topping, index) => <li key={index}>{topping.name}</li>)}
                        </ul>
                    </div>
                ))}
            </div>
        );
    }
};

export const OrdersList = () => {
    return (
        <div className="orders_wrap">
            <h2>Order list</h2>
            <Container />
        </div>)
};