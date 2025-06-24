'use strict'

let logoutButton = new LogoutButton();
logoutButton.action = () => {
  ApiConnector.logout((response) => {
    console.log("Выход из системы:", response);
    if (response.success) {
      location.reload();
    }
  });
};

ApiConnector.current((response) => {
  console.log("Текущий пользователь:", response);
  if (response.success) {
    ProfileWidget.showProfile(response.data);
  }
});

let ratesBoard = new RatesBoard();

function updateRates() {
  ApiConnector.getStocks((response) => {
    console.log("Курсы валют:", response);
    if (response.success) {
      ratesBoard.clearTable();
      ratesBoard.fillTable(response.data);
    }
  });
}

updateRates();
setInterval(updateRates, 60000);

let moneyManager = new MoneyManager();

moneyManager.addMoneyCallback = (data) => {
  ApiConnector.addMoney(data, (response) => {
    console.log("Пополнение баланса:", response);
    if (response.success) {
      ProfileWidget.showProfile(response.data);
    }
    moneyManager.setMessage(response.success, response.error || "Баланс успешно пополнен!");
  });
};

moneyManager.conversionMoneyCallback = (data) => {
  ApiConnector.convertMoney(data, (response) => {
    console.log("Конвертация валюты:", response);
    if (response.success) {
      ProfileWidget.showProfile(response.data);
    }
    moneyManager.setMessage(response.success, response.error || "Конвертация успешно выполнена!");
  });
};

moneyManager.sendMoneyCallback = (data) => {
  ApiConnector.transferMoney(data, (response) => {
    console.log("Перевод денег:", response);
    if (response.success) {
      ProfileWidget.showProfile(response.data);
    }
    moneyManager.setMessage(response.success, response.error || "Перевод успешно выполнен!");
  });
};

let favoritesWidget = new FavoritesWidget();

function updateFavorites() {
  ApiConnector.getFavorites((response) => {
    console.log("Список избранного:", response);
    if (response.success) {
      favoritesWidget.clearTable();
      favoritesWidget.fillTable(response.data);
      moneyManager.updateUsersList(response.data);
    }
  });
}

updateFavorites();

favoritesWidget.addUserCallback = (data) => {
  ApiConnector.addUserToFavorites(data, (response) => {
    console.log("Добавление в избранное:", response);
    if (response.success) {
      updateFavorites();
    }
    favoritesWidget.setMessage(response.success, response.error || "Пользователь успешно добавлен!");
  });
};

favoritesWidget.removeUserCallback = (id) => {
  ApiConnector.removeUserFromFavorites(id, (response) => {
    console.log("Удаление из избранного:", response);
    if (response.success) {
      updateFavorites();
    }
    favoritesWidget.setMessage(response.success, response.error || "Пользователь успешно удален!");
  });
};