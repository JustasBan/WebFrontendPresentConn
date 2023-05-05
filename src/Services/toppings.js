import axios from "axios";
import { apiUrl } from "./config";

export async function postTopping(topping) {
    let data = {"name": topping}

    return await axios.post(
      `${apiUrl}/api/Toppings/AddTopping`,
      data
    );
}

export async function getToppings() {
    return await axios.get(
      `${apiUrl}/api/Toppings`
    );
}
