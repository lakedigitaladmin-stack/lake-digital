// --- LAKE DIGITAL PAYMENT SCRIPT ---

let priceBasics = 250;
const pricePro = 300;
let promoApplied = false;

// Показать блок оплаты при клике на "Get Started"
function initCheckout(plan) {
  const checkoutBlock = document.getElementById('checkout-' + plan);
  if (checkoutBlock.style.display === 'block') {
      checkoutBlock.style.display = 'none';
  } else {
      checkoutBlock.style.display = 'block';
  }
}

// Логика проверки промокода для тарифа Basics
function applyPromo() {
  const codeInput = document.getElementById('promo-input-basics').value.trim().toUpperCase();
  const msg = document.getElementById('promo-msg-basics');
  const priceDisplay = document.getElementById('price-display-basics');

  if (codeInput === 'LAKE230') {
    priceBasics = 230;
    promoApplied = true;
    msg.innerText = "Promo code applied! Price reduced to €230.";
    msg.style.color = "#38bdf8"; // Фирменный цвет Lake Digital
    priceDisplay.innerText = "€230";
    
    // Если галочка согласия уже стоит, перерисовываем кнопку PayPal с новой ценой
    if (document.getElementById('agree-basics').checked) {
        togglePayPal('basics');
    }
  } else {
    msg.innerText = "Invalid promo code.";
    msg.style.color = "#ef4444"; // Красный цвет ошибки
  }
}

// Появление кнопок PayPal после согласия с условиями (Terms & Privacy)
function togglePayPal(plan) {
  const containerId = 'paypal-container-' + plan;
  const container = document.getElementById(containerId);
  const isChecked = document.getElementById('agree-' + plan).checked;

  // Очищаем контейнер перед каждой отрисовкой, чтобы кнопки не дублировались
  container.innerHTML = ''; 

  if (isChecked) {
    container.style.display = 'block';
    
    // Определяем финальную сумму в зависимости от выбранного тарифа
    let amountToCharge = plan === 'basics' ? priceBasics : pricePro;

    paypal.Buttons({
      createOrder: function(data, actions) {
        return actions.order.create({
          purchase_units: [{
            amount: { 
                value: amountToCharge.toString(),
                currency_code: 'EUR'
            },
            description: plan === 'basics' ? 'Lake Digital: Basics Course' : 'Lake Digital: Full Stack Developer'
          }]
        });
      },
      onApprove: function(data, actions) {
        return actions.order.capture().then(function(details) {
          // УСПЕШНАЯ ОПЛАТА: Перенаправление клиента к материалам курса
          window.location.href = 'access-digital-basics/index.html';
        });
      },
      onError: function(err) {
        console.error('PayPal Error:', err);
        alert('Payment could not be processed. Please try again or contact support@lake.digital.admin@gmail.com');
      }
    }).render('#' + containerId);
    
  } else {
    container.style.display = 'none';
  }
}
