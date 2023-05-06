import { postTopping } from "../../Services/toppings";
import { useState } from "react";
import { useFetch } from "./FetchContext";
import { Card, Form, Button, ListGroup } from 'react-bootstrap';

const ToppingsList = () => {
    const { fetch } = useFetch();

    return (
        <Card className="mb-4">
            <Card.Header>
                <h3>Toppings List</h3>
            </Card.Header>
            <ListGroup variant="flush">
                {fetch.toppings.map((item) => (
                    <ListGroup.Item key={item.id}>{item.name}</ListGroup.Item>
                ))}
            </ListGroup>
        </Card>
    );
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
                new_toppings.push({ id: response.data.id, name: response.data.name })
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
        <Card className="mb-4">
            <Card.Header>
                <h3>Upload form</h3>
            </Card.Header>
            <Card.Body>
                {data.state === 'failed' && <p className="error-message"><i>Error in order upload</i></p>}
                {data.state === 'uploading' && <p className="uploading-message"><i>Uploading...</i></p>}
                {data.state === 'success' && <p className="success-message"><i>Upload successful!</i></p>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label><b>Topping name:</b></Form.Label>
                        <Form.Control
                            required
                            type="text"
                            value={data.name}
                            disabled={isFormDisabled}
                            onChange={(e) => setData({ ...data, name: e.target.value })}
                        />
                    </Form.Group>
                    <Button className="uploadButton" type="submit" disabled={isFormDisabled}>
                        Upload topping
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
}

export const Toppings = () => {
    return (
        <div className="toppings_container">
            <h2>Topping Upload</h2>
            <ToppingUpload />
            <ToppingsList />
        </div>
    )
}