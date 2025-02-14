document.addEventListener("DOMContentLoaded", () => {
  let isAddingToCart = false;

  function addToCart(variantId) {
    if (isAddingToCart) {
      return;
    }

    isAddingToCart = true;

    const itemData = {
      items: [
        {
          id: parseInt(variantId),
          quantity: 1
        }
      ]
    };

    fetch('/cart/add.js', {
      method: 'POST',
      body: JSON.stringify(itemData),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(cartData => {
      fetchUpdatedSections();
      return fetch(`/?sections=cart-notification-product,cart-notification-button,cart-icon-bubble`)
        .then(response => response.json())
        .then(sectionData => {
          cartData.items[0].sections = {
            'cart-notification-product': sectionData['cart-notification-product'],
            'cart-notification-button': sectionData['cart-notification-button'],
            'cart-icon-bubble': sectionData['cart-icon-bubble'],
          };

          const cartNotification = document.querySelector('cart-notification');
          if (cartNotification) {
            cartNotification.renderContents(cartData.items[0]);
          }
        });
    })
    .catch(error => {
      console.error('Error adding item to cart:', error);
    })
    .finally(() => {
      isAddingToCart = false;
    });
  }

  function bindAddToCartListeners() {
    document.addEventListener('click', (event) => {
      const button = event.target.closest('.custom-collection__button');
      if (button) {
        const variantId = button.dataset.variantId;
        if (variantId) {
          addToCart(variantId);
        } else {
          console.log("Variant ID is missing.");
        }
      }
    });
  }

  function fetchUpdatedSections() {
    fetch(`/?sections=custom-featured-products`)
      .then(response => response.json())
      .then(sectionData => {
        const customSectionContainer = document.querySelector('.custom-section');
        if (customSectionContainer) {
          customSectionContainer.innerHTML = sectionData['custom-featured-products'];
        }
      })
      .catch(error => console.error('Error fetching custom section:', error));
  }

  bindAddToCartListeners();
});
