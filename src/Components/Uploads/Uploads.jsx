import { Order } from "./Order"
import { Toppings } from "./Toppings"
import { FetchProvider, useFetch } from "./FetchContext"
import { getToppings } from "../../Services/toppings";
import { getSizes } from "../../Services/pizzaOrders";
import { useEffect } from "react";

/* Container for toppings in various fetch states */
const Container = () => {
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

    if (fetch.state === "fetching") {
        return <div className="fetch_loading_container">Loading...</div>;
    } else if (fetch.state === "failed") {
        return (
            <div className="fetch_failed_container">Failed to fetch data.</div>
        );
    } else if (fetch.state === "fetched") {

        return (
            <div className="fetch_success_container">
                <Order />
                <Toppings />
            </div>
        );
    }
};

export const Uploads = () => {

    return (
        <div>
            <FetchProvider>
                <Container />
            </FetchProvider>
        </div>
    )
}