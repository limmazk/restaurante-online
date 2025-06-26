let carrinho = [];
let produtos = [];
let userLocation = null;
let isCartOpen = false;


const produtosData = [
  {
    id: 1,
    nome: "Pizza Marguerita",
    descricao: "Molho de tomate, mussarela, manjericão fresco e azeite",
    preco: 32.90,
    categoria: "pizza",
    imagem: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop"
  },
  {
    id: 2,
    nome: "Pizza Pepperoni",
    descricao: "Molho de tomate, mussarela e pepperoni artesanal",
    preco: 38.90,
    categoria: "pizza",
    imagem: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop"
  },
  {
    id: 3,
    nome: "Hambúrguer Clássico",
    descricao: "Pão brioche, carne 180g, queijo, alface, tomate e molho especial",
    preco: 28.90,
    categoria: "hamburguer",
    imagem: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop"
  },
  {
    id: 4,
    nome: "Hambúrguer Bacon",
    descricao: "Pão brioche, carne 180g, bacon crocante, queijo cheddar",
    preco: 34.90,
    categoria: "hamburguer",
    imagem: "https://images.unsplash.com/photo-1724352476668-6cbd99da2d6b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8aGFtYnVyZ3VlciUyMGRlJTIwYmFjb258ZW58MHx8MHx8fDA%3D"
  },
  {
    id: 5,
    nome: "Yakisoba Tradicional",
    descricao: "Macarrão, legumes frescos, molho shoyu e gergelim",
    preco: 24.90,
    categoria: "yakisoba",
    imagem: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&h=300&fit=crop"
  },
  {
    id: 6,
    nome: "Yakisoba de Frango",
    descricao: "Macarrão, frango grelhado, legumes e molho teriyaki",
    preco: 28.90,
    categoria: "yakisoba",
    imagem: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=300&fit=crop"
  },
  {
    id: 7,
    nome: "Coca-Cola 350ml",
    descricao: "Refrigerante gelado",
    preco: 5.90,
    categoria: "bebida",
    imagem: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=400&h=300&fit=crop"
  },
  {
    id: 8,
    nome: "Suco Natural 500ml",
    descricao: "Suco natural de frutas da estação",
    preco: 8.90,
    categoria: "bebida",
    imagem: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400&h=300&fit=crop"
  },
  {
    id: 9,
    nome: "Pizza Quatro Queijos",
    descricao: "Molho branco, mussarela, gorgonzola, parmesão e provolone",
    preco: 42.90,
    categoria: "pizza",
    imagem: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop"
  },
  {
    id: 10,
    nome: "Hambúrguer Vegano",
    descricao: "Pão integral, hambúrguer de grão-de-bico, alface e tomate",
    preco: 26.90,
    categoria: "hamburguer",
    imagem: "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400&h=300&fit=crop"
  }
];

document.addEventListener('DOMContentLoaded', function () {
  initializeApp();
});

function initializeApp() {
  produtos = [...produtosData];
  renderProducts();
  setupEventListeners();
  createSearchBar();
  loadCartFromStorage();
  updateCartUI();
}

function setupEventListeners() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      const category = this.getAttribute('data-category');
      filterProducts(category);
      updateActiveFilter(this);
    });
  });

  const navLinks = document.querySelectorAll('a[href^="#"]');
  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
      closeMobileMenu();
    });
  });

  window.addEventListener('scroll', handleNavbarScroll);

  document.addEventListener('click', function (e) {
    const cart = document.getElementById('carrinho');
    const cartBtn = document.getElementById('cart-btn');

    if (isCartOpen && !cart.contains(e.target) && !cartBtn.contains(e.target)) {
      fecharCarrinho();
    }
  });
}

function createSearchBar() {
  const searchContainer = document.getElementById('search-container');
  if (searchContainer) {
    searchContainer.innerHTML = `
      <div class="max-w-md mx-auto relative">
        <input 
          type="text" 
          id="search-input" 
          placeholder="Buscar pratos..." 
          class="w-full px-6 py-3 pl-12 rounded-full border-2 border-gray-200 focus:border-red-500 focus:outline-none transition-colors duration-300"
        >
        <i class="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
      </div>
    `;

    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', function () {
      const searchTerm = this.value.toLowerCase();
      searchProducts(searchTerm);
    });
  }
}

function searchProducts(searchTerm) {
  const filteredProducts = produtos.filter(produto =>
    produto.nome.toLowerCase().includes(searchTerm) ||
    produto.descricao.toLowerCase().includes(searchTerm)
  );
  renderFilteredProducts(filteredProducts);
}

function filterProducts(category) {
  if (category === 'todos') {
    renderProducts();
  } else {
    const filteredProducts = produtos.filter(produto => produto.categoria === category);
    renderFilteredProducts(filteredProducts);
  }
}

function updateActiveFilter(activeBtn) {
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(btn => {
    btn.classList.remove('bg-gradient-to-r', 'from-red-500', 'to-red-600', 'text-white', 'border-red-500', 'shadow-lg');
    btn.classList.add('border-gray-200', 'text-gray-600');
  });

  activeBtn.classList.remove('border-gray-200', 'text-gray-600');
  activeBtn.classList.add('bg-gradient-to-r', 'from-red-500', 'to-red-600', 'text-white', 'border-red-500', 'shadow-lg');
}

function renderProducts() {
  renderFilteredProducts(produtos);
}

function renderFilteredProducts(productsToRender) {
  const grid = document.getElementById('produtos-grid');
  if (!grid) return;

  if (productsToRender.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full text-center py-20">
        <i class="fas fa-search text-4xl text-gray-300 mb-4"></i>
        <p class="text-gray-500 text-lg">Nenhum produto encontrado</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = productsToRender.map(produto => `
    <article class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group">
      <div class="relative overflow-hidden">
        <img 
          src="${produto.imagem}" 
          alt="${produto.nome}"
          class="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
          onerror="this.src='https://via.placeholder.com/400x300/f3f4f6/9ca3af?text=Imagem+Indisponível'"
        >
        <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div class="absolute top-4 right-4">
          <span class="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            ${getCategoryIcon(produto.categoria)}
          </span>
        </div>
      </div>
      
      <div class="p-6">
        <h3 class="text-xl font-bold mb-2 text-gray-800 group-hover:text-red-500 transition-colors duration-300">
          ${produto.nome}
        </h3>
        <p class="text-gray-600 mb-4 text-sm leading-relaxed">
          ${produto.descricao}
        </p>
        
        <div class="flex items-center justify-between">
          <div class="text-2xl font-bold text-red-500">
            R$ ${produto.preco.toFixed(2).replace('.', ',')}
          </div>
          <button 
            onclick="adicionarAoCarrinho(${produto.id})"
            class="bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold px-6 py-3 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
          >
            <i class="fas fa-plus"></i>
            <span>Adicionar</span>
          </button>
        </div>
      </div>
    </article>
  `).join('');
}

function getCategoryIcon(category) {
  const icons = {
    pizza: '🍕',
    hamburguer: '🍔',
    yakisoba: '🍜',
    bebida: '🥤'
  };
  return icons[category] || '🍽️';
}

function adicionarAoCarrinho(produtoId) {
  const produto = produtos.find(p => p.id === produtoId);
  if (!produto) return;

  const itemExistente = carrinho.find(item => item.id === produtoId);

  if (itemExistente) {
    itemExistente.quantidade += 1;
  } else {
    carrinho.push({
      ...produto,
      quantidade: 1
    });
  }

  updateCartUI();
  saveCartToStorage();
  showToast(`${produto.nome} adicionado ao carrinho!`, 'success');

  const cartBtn = document.getElementById('cart-btn');
  cartBtn.classList.add('animate-bounce');
  setTimeout(() => {
    cartBtn.classList.remove('animate-bounce');
  }, 1000);
}

function removerDoCarrinho(produtoId) {
  const index = carrinho.findIndex(item => item.id === produtoId);
  if (index > -1) {
    const produto = carrinho[index];
    carrinho.splice(index, 1);
    updateCartUI();
    saveCartToStorage();
    showToast(`${produto.nome} removido do carrinho!`, 'info');
  }
}

function atualizarQuantidade(produtoId, novaQuantidade) {
  const item = carrinho.find(item => item.id === produtoId);
  if (item) {
    if (novaQuantidade <= 0) {
      removerDoCarrinho(produtoId);
    } else {
      item.quantidade = novaQuantidade;
      updateCartUI();
      saveCartToStorage();
    }
  }
}

function updateCartUI() {
  updateCartCount();
  updateCartItems();
  updateCartTotal();
}

function updateCartCount() {
  const cartCount = document.getElementById('cart-count');
  const totalItems = carrinho.reduce((total, item) => total + item.quantidade, 0);

  if (totalItems > 0) {
    cartCount.textContent = totalItems;
    cartCount.classList.remove('hidden');
  } else {
    cartCount.classList.add('hidden');
  }
}

function updateCartItems() {
  const itensCarrinho = document.getElementById('itens-carrinho');
  const btnFinalizar = document.getElementById('btn-finalizar');

  if (carrinho.length === 0) {
    itensCarrinho.innerHTML = `
      <div class="text-center py-20">
        <i class="fas fa-shopping-cart text-4xl text-gray-300 mb-4"></i>
        <p class="text-gray-500">Seu carrinho está vazio</p>
      </div>
    `;
    btnFinalizar.classList.add('hidden');
  } else {
    itensCarrinho.innerHTML = carrinho.map(item => `
      <div class="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl mb-4">
        <img 
          src="${item.imagem}" 
          alt="${item.nome}"
          class="w-16 h-16 object-cover rounded-lg"
          onerror="this.src='https://via.placeholder.com/64x64/f3f4f6/9ca3af?text=Produto'"
        >
                <div class="flex-1">
          <h4 class="font-semibold text-gray-800">${item.nome}</h4>
          <p class="text-sm text-gray-600">R$ ${item.preco.toFixed(2).replace('.', ',')}</p>
        </div>
        <div class="flex items-center space-x-2">
          <button 
            onclick="atualizarQuantidade(${item.id}, ${item.quantidade - 1})"
            class="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            <i class="fas fa-minus text-xs"></i>
          </button>
          <span class="w-8 text-center font-semibold">${item.quantidade}</span>
          <button 
            onclick="atualizarQuantidade(${item.id}, ${item.quantidade + 1})"
            class="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
          >
            <i class="fas fa-plus text-xs"></i>
          </button>
        </div>
        <button 
          onclick="removerDoCarrinho(${item.id})"
          class="w-8 h-8 bg-gray-500 text-white rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors"
        >
          <i class="fas fa-trash text-xs"></i>
        </button>
      </div>
    `).join('');
    btnFinalizar.classList.remove('hidden');
  }
}

function updateCartTotal() {
  const total = carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
  const totalElement = document.getElementById('total');
  if (totalElement) {
    totalElement.textContent = total.toFixed(2).replace('.', ',');
  }
}

function abrirCarrinho() {
  const carrinho = document.getElementById('carrinho');
  carrinho.classList.remove('translate-x-full');
  isCartOpen = true;
  document.body.style.overflow = 'hidden';
}

function fecharCarrinho() {
  const carrinho = document.getElementById('carrinho');
  carrinho.classList.add('translate-x-full');
  isCartOpen = false;
  document.body.style.overflow = 'auto';
}

function finalizarPedido() {
  if (carrinho.length === 0) {
    showToast('Seu carrinho está vazio!', 'error');
    return;
  }

  const total = carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
  let mensagem = '*🍽️ PEDIDO - DELÍCIAS EXPRESS*%0A%0A';

  carrinho.forEach(item => {
    mensagem += `*${item.nome}*%0A`;
    mensagem += `Quantidade: ${item.quantidade}%0A`;
    mensagem += `Preço unitário: R$ ${item.preco.toFixed(2).replace('.', ',')}%0A`;
    mensagem += `Subtotal: R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}%0A%0A`;
  });

  mensagem += `*💰 TOTAL: R$ ${total.toFixed(2).replace('.', ',')}*%0A%0A`;
  mensagem += `📍 *Endereço de entrega:*%0A`;

  if (userLocation && userLocation.address) {
    mensagem += userLocation.address;
  } else {
    mensagem += 'A definir';
  }

  const whatsappUrl = `https://wa.me/5511999999999?text=${mensagem}`;
  window.open(whatsappUrl, '_blank');

  showToast('Redirecionando para WhatsApp...', 'success');
}

function toggleMobileMenu() {
  const mobileMenu = document.getElementById('mobile-menu');
  mobileMenu.classList.toggle('hidden');
}

function closeMobileMenu() {
  const mobileMenu = document.getElementById('mobile-menu');
  mobileMenu.classList.add('hidden');
}

function handleNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (window.scrollY > 100) {
    navbar.classList.add('bg-white/95');
    navbar.classList.remove('bg-white/90');
  } else {
    navbar.classList.add('bg-white/90');
    navbar.classList.remove('bg-white/95');
  }
}

function obterLocalizacao() {
  if (!navigator.geolocation) {
    showToast('Geolocalização não é suportada pelo seu navegador', 'error');
    return;
  }

  showLoading();

  navigator.geolocation.getCurrentPosition(
    function (position) {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      setTimeout(() => {
        userLocation = {
          lat: lat,
          lng: lng,
          address: `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`
        };

        displayUserLocation();
        checkDeliveryArea();
        hideLoading();
        showToast('Localização obtida com sucesso!', 'success');
      }, 1500);
    },
    function (error) {
      hideLoading();
      let errorMessage = 'Erro ao obter localização';

      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Permissão de localização negada';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Localização indisponível';
          break;
        case error.TIMEOUT:
          errorMessage = 'Tempo limite para obter localização';
          break;
      }

      showToast(errorMessage, 'error');
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000
    }
  );
}

function verificarDelivery() {
  if (!userLocation) {
    obterLocalizacao();
  } else {
    checkDeliveryArea();
  }
}

function displayUserLocation() {
  const userLocationDiv = document.getElementById('user-location');
  const userAddressSpan = document.getElementById('user-address');

  if (userLocationDiv && userAddressSpan) {
    userAddressSpan.textContent = userLocation.address;
    userLocationDiv.classList.remove('hidden');
  }
}

function checkDeliveryArea() {
  const deliveryStatusDiv = document.getElementById('delivery-status');
  if (deliveryStatusDiv) {
    const isInDeliveryArea = Math.random() > 0.3;

    if (isInDeliveryArea) {
      deliveryStatusDiv.innerHTML = `
        <span class="text-green-600 flex items-center">
          <i class="fas fa-check-circle mr-2"></i>
          ✅ Delivery disponível para sua região!
        </span>
      `;
    } else {
      deliveryStatusDiv.innerHTML = `
        <span class="text-red-600 flex items-center">
          <i class="fas fa-times-circle mr-2"></i>
          ❌ Fora da área de delivery
        </span>
      `;
    }
  }
}

function saveCartToStorage() {
  try {
    localStorage.setItem('delicias-express-cart', JSON.stringify(carrinho));
  } catch (error) {
    console.error('Erro ao salvar carrinho:', error);
  }
}

function loadCartFromStorage() {
  try {
    const savedCart = localStorage.getItem('delicias-express-cart');
    if (savedCart) {
      carrinho = JSON.parse(savedCart);
    }
  } catch (error) {
    console.error('Erro ao carregar carrinho:', error);
    carrinho = [];
  }
}

function showLoading() {
  const loading = document.getElementById('loading');
  if (loading) {
    loading.classList.remove('hidden');
  }
}

function hideLoading() {
  const loading = document.getElementById('loading');
  if (loading) {
    loading.classList.add('hidden');
  }
}

function showToast(message, type = 'info') {
  const toastContainer = document.getElementById('toast-container');
  if (!toastContainer) return;

  const toastId = 'toast-' + Date.now();
  const iconMap = {
    success: 'fas fa-check-circle text-green-500',
    error: 'fas fa-times-circle text-red-500',
    info: 'fas fa-info-circle text-blue-500',
    warning: 'fas fa-exclamation-triangle text-yellow-500'
  };

  const bgMap = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
    warning: 'bg-yellow-50 border-yellow-200'
  };

  const toast = document.createElement('div');
  toast.id = toastId;
  toast.className = `${bgMap[type]} border-l-4 p-4 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300 max-w-sm`;

  toast.innerHTML = `
    <div class="flex items-center space-x-3">
      <i class="${iconMap[type]}"></i>
      <p class="text-gray-800 font-medium">${message}</p>
      <button onclick="removeToast('${toastId}')" class="text-gray-400 hover:text-gray-600">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.remove('translate-x-full');
  }, 100);

  setTimeout(() => {
    removeToast(toastId);
  }, 5000);
}

function removeToast(toastId) {
  const toast = document.getElementById(toastId);
  if (toast) {
    toast.classList.add('translate-x-full');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function highlightNavLink() {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.pageYOffset >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('text-red-500');
      link.classList.add('text-gray-700');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.remove('text-gray-700');
        link.classList.add('text-red-500');
      }
    });
  }

  window.addEventListener('scroll', highlightNavLink);
});

document.addEventListener('DOMContentLoaded', function () {
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    img.addEventListener('load', function () {
      this.classList.add('animate-fade-in-up');
    });
  });
});

if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        imageObserver.unobserve(img);
      }
    });
  });

  document.addEventListener('DOMContentLoaded', function () {
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
  });
}

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && isCartOpen) {
    fecharCarrinho();
  }

  if (e.ctrlKey && e.shiftKey && e.key === 'C') {
    abrirCarrinho();
  }
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/sw.js')
      .then(function (registration) {
        console.log('ServiceWorker registration successful');
      })
      .catch(function (err) {
        console.log('ServiceWorker registration failed');
      });
  });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    adicionarAoCarrinho,
    removerDoCarrinho,
    atualizarQuantidade,
    filterProducts,
    searchProducts
  };
}
