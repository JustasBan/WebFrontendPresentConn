import { postTopping } from "../../Services/toppings";
import { useState } from "react";
import { useFetch } from "./FetchContext";

const ToppingsList = () => {
    const { fetch } = useFetch();

    return (
        <div className="toppings_list_container">
            <h2>Toppings list</h2>
            { fetch.toppings.map((item) => ( <p key={item.id}>{item.name}</p> ))}
        </div>)
};

const ToppingUpload = () => {
    const { fetch, setFetch } = useFetch();
    const [data, setData] = useState(
        {
            name: "",
            state: ""
        }
    );

    const handleSubmit = async (event) => {
        event.preventDefault()

        setData({ ...data, state: "uploading" })

        postTopping(data.name)
            .then((response) => {
                let new_toppings = fetch.toppings
                new_toppings.push({id: response.data.id, name: response.data.name})
                setFetch({ ...fetch, toppings: new_toppings });
                setData({ name: "", state: "success" })
            })
            .catch((error) => {
                setData({ ...data, state: "failed" })
                console.log(error);
            })
    }

    //disable upload button while uploading, to prevent spamming
    const isFormDisabled = data.state === 'uploading';

    return (
        <div className="topping_upload_container">
            <h2>Topping upload</h2>
            {data.state === 'failed' && <p className="error-message"><i>Error in order upload</i></p>}
            {data.state === 'uploading' && <p className="uploading-message"><i>Uploading...</i></p>}
            {data.state === 'success' && <p className="success-message"><i>Upload successful!</i></p>}

            <div className='upload_input_container'>
                <form onSubmit={handleSubmit}>
                    <label>Topping name:</label> <br />
                    <input required type="text" value={data.name} disabled={isFormDisabled} onChange={(e) => setData({ ...data, name: e.target.value })} /> <br />
                    <button className="uploadButton" type="submit" disabled={isFormDisabled}>Upload topping</button>
                </form>
            </div>
        </div>
    )
}

export const Toppings = () => {
    return (
        <div className="toppings_container">
                <ToppingUpload />
                <ToppingsList />
        </div>
    )
}