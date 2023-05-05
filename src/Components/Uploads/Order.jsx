import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { OrderProvider, useOrder } from "./OrderContext";
import { useFetch } from "./FetchContext";
import { getEstimate, postOrder } from "../../Services/pizzaOrders";

const OrderCreator = () => {
    const { fetch } = useFetch();
    const { order, setOrder } = useOrder();

    //size handling:
    const [selectedOption1, setSelectedOption1] = useState("0");

    const handleChangeSize = (event) => {
        let selectedValue = event.target.value;
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
        let selectedValue = event.target.value;

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
        <div>
            <h3>Order creation tool</h3>
            <form onSubmit={handleAddSize}>
                <label>Size:</label>
                <select onChange={handleChangeSize}>
                    {fetch.size.map((option, index) => (
                        <option key={index} value={index}>
                            {option}
                        </option>
                    ))}
                </select>
                <button className="uploadButton" type="submit">select size</button>
            </form>{

                <form onSubmit={handleAddTopping}>
                    <label>Toppings:</label>

                    <select value={selectedOption2 || ''} onChange={handleChangeTopping}>
                        {
                            fetch.toppings !== [] && fetch.toppings.map((topping) => (
                                <option key={topping.id} value={topping.id}>
                                    {topping.name}
                                </option>
                            ))
                        }
                    </select>
                    <button className="uploadButton" type="submit">Add topping</button>
                </form>}
        </div>
    )
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
        <div>
            <h3>Price calculator</h3>
            <div>
                <p><b>Size: </b>{fetch.size[order.size]}</p>
            </div>
            <div>
                <b>Toppings:</b>
                {order.toppings.length === 0 && <p>No toppings selected</p>}
                {order.toppings.length > 0 && order.toppings.map((topping, index) => (
                    <div key={index} style={{ display: "block ruby" }}>
                        <p >{fetch.toppings[parseInt(topping) - 1].name}</p>
                        <button onClick={() => handleRemove(index)}>Remove topping</button>
                    </div>
                ))}
            </div>
            <div><b>Price: </b>{price}</div>
        </div>
    )
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
        <div>
            <h3>Submit order</h3>
            {order.toppings.length === 0 && <p>Order must have atleast one topping</p>}
            {(order.size === "3") && <p>Order must have a size</p>}
            {data.state === 'failed' && <p className="error-message"><i>Error in order upload</i> </p>}
            {data.state === 'uploading' && <p className="uploading-message"><i>Uploading...</i></p>}
            {data.state === 'success' && <p className="success-message"><i>Upload successful!</i></p>}

            <div className='upload_input_container'>
                <form onSubmit={handleSubmit}>
                    <label><b>Order name:</b></label> 
                    <input required type="text" value={data.name} disabled={isFormDisabled} onChange={(e) => setData({ ...data, name: e.target.value })} /> 
                    <button className="uploadButton" type="submit" disabled={isFormDisabled}>Upload order</button>
                </form>
            </div>
        </div>
    )
}

export const Order = () => {
    return (
        <div>
            <h2>Order upload</h2>
            <OrderProvider>
                <OrderCreator />
                <PriceEstimation />
                <OrderSubmit />
            </OrderProvider>
            <h2>Order list</h2>
            <p><Link to={`/ordersList`}>Go to orders list</Link></p>
        </div>
    )
}