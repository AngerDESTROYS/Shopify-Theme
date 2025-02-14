class CustomFeaturedCollection extends HTMLElement {
  constructor() {
    super();
    this.isAddingToCart = false;
    document.addEventListener("DOMContentLoaded", this.render.bind(this));
  }

  render() {
    this.bindAddToCartListeners();
  }

  addToCart(variantId) {
    if (this.isAddingToCart) {
      return;
    }

    this.isAddingToCart = true;

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
      this.fetchUpdatedSections();
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
      this.isAddingToCart = false;
    });
  }

  bindAddToCartListeners() {
    document.addEventListener('click', (event) => {
      const button = event.target.closest('.custom-collection__button');
      if (button) {
        const variantId = button.dataset.variantId;
        if (variantId) {
          this.addToCart(variantId);
        } else {
          console.log("Variant ID is missing.");
        }
      }
    });
  }

  fetchUpdatedSections() {
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
}

customElements.define("custom-featured-products", CustomFeaturedCollection);
