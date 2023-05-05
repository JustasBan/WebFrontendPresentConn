# Front-end of "Present connection" 2023 Internship task
Front-end was made in React with integrated API endpoints from back-end & bootstrap styling. 

## Running production:
CI pipeline was set up with Github Actions & Azure

[Visit deployed site](https://gentle-river-0e0693903.3.azurestaticapps.net/)

## Running development:

### 1. [run back-end api](https://github.com/JustasBan/WebBackPresentConn)
### 2. `npm start` the project in root directory

## Test data for back-end API:
### Multiple toppings:
[
  {
    "id": 0,
    "name": "Cheddar"
  },
  {
    "id": 0,
    "name": "Mozzarella"
  },
  {
    "id": 0,
    "name": "Chorizo"
  },
  {
    "id": 0,
    "name": "Kumato"
  },
  {
    "id": 0,
    "name": "Salami"
  },
  {
    "id": 0,
    "name": "Cucumber"
  }
]

### Multiple orders:
[
  {
    "id": 0,
    "size": 0,
    "totalCost": 0,
    "name": "Order for John A.",
    "toppingIds": [
      1, 1, 3, 1
    ]
  },
  {
    "id": 0,
    "size": 1,
    "totalCost": 0,
    "name": "Order for Katherine L.",
    "toppingIds": [
      4, 2
    ]
  },
  {
    "id": 0,
    "size": 2,
    "totalCost": 0,
    "name": "Order for Peter C.",
    "toppingIds": [
      1
    ]
  }
]


