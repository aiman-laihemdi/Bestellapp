const basketDialog = document.getElementById("basketDialog");

// functions
function init(){
    renderOurDishes();
    renderBasketDialog();
    renderOrderBasket();
}

function renderOurDishes(){
    let ourDishes = document.getElementById("ourDishes")
        ourDishes.innerHTML = "";

    for (let i = 0; i < dishes.length; i++) {
        let dish = dishes[i];

        ourDishes.innerHTML += getHTMLDishes(dish, i);
    }

};

function getHTMLDishes(dish, i){
    return `
            <div class="myDish">
                    <img class="menuIMG" src="${dish.img}" alt="${dish.name}">
                    <div class="contentDish">
                        <h3>${dish.name}</h3>
                        <p>${dish.Ingredients}</p>
                        <span class="priceBtn">
                            <p>${dish.price.toFixed(2).replace(".",(","))} €</p>
                            <button onclick="addToBasket(${i})" class="btnAdd">add to basket</button>
                        </span>
                    </div>
            </div>
    `
};

function renderBasketDialog(){
    let ourBasketDialog = document.getElementById("basketDialog");
        ourBasketDialog.innerHTML = getMyDialogHTML();

}

function getMyDialogHTML(){
    return `
            <section id="basket" class="basket">
                    <button onclick="closeBasketDialog()">✕</button>
                    <h1>Your Basket</h1>
                <div id="orderBasket" class="orderBasket">
                    <h3>Your Basket</h3>
                </div>
                <table>
                    <tr>
                        <td>Subtotal</td>
                        <td id="subtotal">0,00 €</td>
                    </tr>
                    <tr>
                        <td>Delivery fee</td>
                        <td id="deliveryFee">4,99 €</td>
                    </tr>
                </table>
                <table class="totalCost">
                    <tr>
                        <td>Total</td>
                        <td id="total">0,00 €</td>
                    </tr>
                </table>
            </section>
    `
};

function openBasketDialog(i){
    let ourBasketDialog = document.getElementById("basketDialog");
    
    renderOrderBasket();
    
    ourBasketDialog.showModal();
}

function closeBasketDialog(){
    let ourBasketDialog = document.getElementById("basketDialog");
    ourBasketDialog.close();
}

function addToBasket(i) {
    let dish = dishes[i];

    let existingDish = basket.find(item => item.name === dish.name);

    if (existingDish) {
        existingDish.quantity++;
    } else {
        basket.push({
            ...dish,
            quantity: 1
        });
    }

    updateCartIcon();
    renderOrderBasket();

    // if (!basketDialog.open) {
    //     basketDialog.showModal();
    // }
}

function renderOrderBasket(){
    let orderBasket = document.getElementById("orderBasket");
    orderBasket.innerHTML = "";

    for (let i = 0; i < basket.length; i++) {
        let myBasket = basket[i];

        orderBasket.innerHTML += `
            <div class="orderBasketDialog">
                <h3>${myBasket.name}</h3>

                <p>${myBasket.price.toFixed(2).replace(".", ",")} €</p>

                <div class="basket-controls">
                    <button onclick="changeQuantity(${i}, -1)">−</button>

                    <span>${myBasket.quantity}</span>

                    <button onclick="changeQuantity(${i}, 1)">+</button>
                </div>
            </div>
        `;
    }

    calculateBasket();
}

function calculateBasket() {
    let subtotal = basket.reduce((sum, dish) => {
        return sum + dish.price * dish.quantity;
    }, 0);

    let deliveryFee;

    if (basket.length > 0) {
        deliveryFee = 4.99;
    } else {
        deliveryFee = 0;
    }

    let total = subtotal + deliveryFee;

    document.getElementById("subtotal").innerHTML =
    subtotal.toFixed(2).replace(".", ",") + " €";

    document.getElementById("total").innerHTML =
    total.toFixed(2).replace(".", ",") + " €";

    document.getElementById("deliveryFee").innerHTML =
    deliveryFee.toFixed(2).replace(".", ",") + " €";
}

function updateCartIcon() {
    let cartIcon = document.getElementById("cartIcon");
    let cartCount = document.getElementById("cartCount");

    cartCount.innerHTML = basket.length;

    cartIcon.src = basket.length > 0
        ? "./assets/icon/shopping_cart.png"
        : "./assets/icon/shopping_cart (1).png";
}

function changeQuantity(index, amount) {
    basket[index].quantity += amount;

    if (basket[index].quantity <= 0) {
        basket.splice(index, 1);
    }

    renderOrderBasket();
    updateCartIcon();
}