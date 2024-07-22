let items = [];

function saveItemsToStorage() {
  localStorage.setItem('items', JSON.stringify(items));
}

function loadItemsFromStorage() {
  const itemsString = localStorage.getItem('items');
  if (itemsString) {
    items = JSON.parse(itemsString);
  }
}

function addItem(name, description, photo) {
  const newItem = { name, description, photo };
  items.push(newItem);
  saveItemsToStorage();
  renderItemList();
}

function deleteItem(index) {
  items.splice(index, 1);
  saveItemsToStorage();
  renderItemList();
}

function updateItem(index, name, description, photo) {
  items[index].name = name;
  items[index].description = description;
  items[index].photo = photo;
  saveItemsToStorage();
  renderItemList();
}

function renderItemList() {
  const itemList = document.getElementById('item-list');
  itemList.innerHTML = '';
  items.forEach((item, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.name}</td>
      <td>${item.description}</td>
      <td><img src="${item.photo}" alt="Foto"></td>
      <td>
        <button onclick="editItem(${index})">Editar</button>
        <button onclick="deleteItem(${index})">Excluir</button>
      </td>
    `;
    itemList.appendChild(tr);
  });
}

function editItem(index) {
  const item = items[index];
  const name = prompt('Novo nome:', item.name);
  const description = prompt('Nova descrição:', item.description);
  if (name !== null && description !== null) {
    const photo = item.photo;  // Assuming the photo remains the same for simplicity
    updateItem(index, name, description, photo);
  }
}

// Captura de Foto
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureButton = document.getElementById('capture-photo');

navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
  })
  .catch(error => {
    console.error('Erro ao acessar câmera:', error);
  });

captureButton.addEventListener('click', () => {
  const context = canvas.getContext('2d');
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  const photoData = canvas.toDataURL('image/png');
  
  const name = document.getElementById('name').value;
  const description = document.getElementById('description').value;
  if (name && description) {
    addItem(name, description, photoData);
    document.getElementById('add-form').reset();
  } else {
    alert('Por favor, preencha todos os campos.');
  }
});

// Event Listener para o formulário
document.getElementById('add-form').addEventListener('submit', function(event) {
  event.preventDefault();
  const name = document.getElementById('name').value;
  const description = document.getElementById('description').value;
  const photoData = canvas.toDataURL('image/png');  // Captura uma foto padrão (pode ser ajustada)
  if (name && description) {
    addItem(name, description, photoData);
    document.getElementById('add-form').reset();
  } else {
    alert('Por favor, preencha todos os campos.');
  }
});

// Inicialização
loadItemsFromStorage();
renderItemList();
