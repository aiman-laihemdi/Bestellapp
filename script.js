const basketDialog = document.getElementById("basketDialog");

// functions
function init(){
    renderOurDishes();
    renderBasketDialog();
    renderDesktopBasket();
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
                            <button onclick="addToBasket(${i})" class="btnAdd">Add to basket</button>
                        </span>
                    </div>
            </div>
    `
};

function getMyDialogHTML(type){
    return `
        <section class="basket">

            ${type === "mobile" ? 
                '<button class="closeBtn" onclick="closeBasketDialog()">✕</button>' : ""}

            <h1>Your Basket</h1>

            <p id="emptyCart-${type}" class="empty-cart">
                Your cart is empty
            </p>

            <div id="orderBasket-${type}" class="orderBasket"></div>

            <div id="basketSummary-${type}" class="basket-summary">

                <table>
                    <tr>
                        <td>Subtotal</td>
                        <td id="subtotal-${type}">0,00 €</td>
                    </tr>
                    <tr>
                        <td>Delivery fee</td>
                        <td id="deliveryFee-${type}">0,00 €</td>
                    </tr>
                </table>

                <table class="totalCost">
                    <tr>
                        <td>Total</td>
                        <td id="total-${type}">0,00 €</td>
                    </tr>
                </table>

                <button class="btnPay" onclick="payOrder()">
                    Pay <span id="payTotal-${type}">0,00 €</span>
                </button>

            </div>
        </section>
    `;
}


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

    renderBasketItems("mobile");
    renderBasketItems("desktop");

}

function renderBasketItems(type){

    let orderBasket = document.getElementById(`orderBasket-${type}`);

    if (!orderBasket) return;

    orderBasket.innerHTML = "";

    let emptyCart = document.getElementById(`emptyCart-${type}`);
    let basketSummary = document.getElementById(`basketSummary-${type}`);

    emptyCart.style.display = basket.length === 0 ? "block" : "none";
    basketSummary.style.display = basket.length === 0 ? "none" : "flex";

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

    calculateBasket(type);
}

function calculateBasket(type) {

    let subtotal = basket.reduce((sum, dish) => {
        return sum + dish.price * dish.quantity;
    }, 0);

    let deliveryFee = basket.length > 0 ? 4.99 : 0;

    let total = subtotal + deliveryFee;

    document.getElementById(`subtotal-${type}`).innerHTML =
        subtotal.toFixed(2).replace(".", ",") + " €";

    document.getElementById(`total-${type}`).innerHTML =
        total.toFixed(2).replace(".", ",") + " €";

    document.getElementById(`payTotal-${type}`).innerHTML =
        total.toFixed(2).replace(".", ",") + " €";

    document.getElementById(`deliveryFee-${type}`).innerHTML =
        deliveryFee.toFixed(2).replace(".", ",") + " €";
}

function updateCartIcon() {
    let cartCount = document.getElementById("cartCount");

    let totalQuantity = basket.reduce((sum, dish) => {
        return sum + dish.quantity;
    }, 0);

    cartCount.innerHTML = totalQuantity;
}

function changeQuantity(index, amount) {
    basket[index].quantity += amount;

    if (basket[index].quantity <= 0) {
        basket.splice(index, 1);
    }

    renderOrderBasket();
    updateCartIcon();
}

function payOrder() {
    if (basket.length === 0) {
        alert("Your basket is empty!");
        return;
    }

    document.body.insertAdjacentHTML("beforeend", `
        <div class="success-overlay" id="successOverlay">
            <div class="success-modal">
                <img src="assets/icon/wk-logo-removebg-preview.png" alt="Delicious pizza">

                <h2>Thank you for your order!</h2>

                <span class="succes-overlay-btn">
                    <button class="btnOrderConfirm" onclick="closeSuccessModal()">
                        Continue
                    </button>
                </span>
            </div>
        </div>
    `);
}

function renderBasketDialog(){
    let ourBasketDialog = document.getElementById("basketDialog");
    ourBasketDialog.innerHTML = getMyDialogHTML("mobile");
}

function renderDesktopBasket(){
    let desktopBasket = document.getElementById("desktopBasketContent");
    desktopBasket.innerHTML = getMyDialogHTML("desktop");
}

function closeSuccessModal() {
    document.getElementById("successOverlay").remove();
}