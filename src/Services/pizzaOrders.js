import axios from "axios";
import { apiUrl } from "./config";

export async function postOrder(size, toppings, name) {
  let data = {
    "size": size,
    "toppingIds": toppings,
    "name": name
  }

  return await axios.post(
    `${apiUrl}/api/PizzaOrders/AddPizzaOrder`,
    data
  );
}

export async function getSizes() {
  return await axios.get(
    `${apiUrl}/api/PizzaOrders/sizes`
  );
}

export async function getOrders() {
  return await axios.get(
    `${apiUrl}/api/PizzaOrders`
  );
}

export async function getOrderById(id) {
  return await axios.get(
    `${apiUrl}/api/PizzaOrders/${id}`
  );
}

export async function getEstimate(size, toppings) {
  return await axios.post(
    `${apiUrl}/api/PizzaOrders/estimate?size=${size}`,
    toppings
  );

}