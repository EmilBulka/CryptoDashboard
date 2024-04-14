class CryptoCurrency {
  constructor(
    id,
    rank,
    symbol,
    name,
    supply,
    maxSupply,
    marketCapUsd,
    volumeUsd24Hr,
    price,
    changePercent24Hr,
    vwap24Hr,
    explorer
  ) {
    this.id = id;
    this.rank = rank;
    this.symbol = symbol;
    this.name = name;
    this.price = price;
    this.changePercent24Hr = changePercent24Hr;
    this.marketCapUsd = marketCapUsd;
    this.vwap24Hr = vwap24Hr;
    this.volumeUsd24Hr = volumeUsd24Hr;
    this.supply = supply;
    this.maxSupply = maxSupply;
    this.explorer = explorer;
  }
}

function createTableContent(data) {
  let boxContainer = document.getElementById("box-container");
  let box = document.createElement("div");
  box.setAttribute("id", "rate-container");
  let boxRow;
  let boxRowMain;
  let boxRowSub;
  let boxRowSubLabel;
  let boxRowSubContent;
  let rowCell;
  let cellContent;
  let cellContentInner;
  const rowMainCells = [
    "id",
    "rank",
    "symbol",
    "name",
    "price",
    "changePercent24Hr",
    "marketCapUsd",
  ];
  const rowSubCells = [
    "vwap(24h)",
    "volume(24h)",
    "supply",
    "max Supply",
    "explorer",
  ];

  for (let i = 0; i < data.length; i++) {
    boxRow = document.createElement("div");
    boxRow.classList.add("box-row");
    boxRow.setAttribute("id", `box-row-${i}`);

    boxRowMain = document.createElement("div");
    boxRowMain.classList.add("box-row-main");
    boxRowMain.setAttribute("id", `box-row-main-${i}`);

    boxRowSub = document.createElement("div");
    boxRowSub.classList.add("box-row-sub");
    boxRowSub.setAttribute("id", `box-row-sub-${i}`);

    boxRowSubLabel = document.createElement("div");
    boxRowSubLabel.classList.add("box-row-sub-label");
    boxRowSubLabel.setAttribute("id", `box-row-sub-label-${i}`);
    boxRowSubContent = document.createElement("div");
    boxRowSubContent.classList.add("box-row-sub-content");
    boxRowSubContent.setAttribute("id", `box-row-sub-content-${i}`);

    let propIndex = 0;
    for (const prop in data[i]) {
      rowCell = document.createElement("div");
      rowCell.classList.add(`row-cell`);
      cellContent = document.createElement("div");

      if (prop !== "id") {
        cellContent.classList.add(`cell-content-${prop}`);
        cellContent.setAttribute("id", `cell-content-${prop}-${i}`);
        cellContent.textContent = `${data[i][prop]}`;
      } else {
        cellContent.classList.add(`cell-content-fav`);
        cellContentInner = document.createElement("div");
        cellContentInner.classList.add(`cell-content-fav-${data[i][prop]}`);
        cellContentInner.innerHTML = `<i class="fa-solid fa-heart fav"></i>`;
        cellContent.appendChild(cellContentInner);
      }

      if (prop !== "") {
        rowCell.appendChild(cellContent);
      }

      if (rowMainCells.includes(prop)) {
        boxRowMain.appendChild(rowCell);
      } else {
        let boxRowSubLabelCell = document.createElement("div");
        boxRowSubLabelCell.innerText = rowSubCells[propIndex];
        boxRowSubLabel.appendChild(boxRowSubLabelCell);

        let boxRowSubContentCell = document.createElement("div");
        if (prop != "explorer") boxRowSubContentCell.innerText = data[i][prop];
        else {
          boxRowSubContentCell = document.createElement("a");
          boxRowSubContentCell.classList.add("link");
          boxRowSubContentCell.href = `${data[i][prop]}`;
          boxRowSubContentCell.innerHTML =
            '<i class="fa-solid fa-arrow-up-right-from-square"></i>';
        }

        boxRowSubContent.appendChild(boxRowSubContentCell);
        propIndex++;
      }
    }

    rowCell = document.createElement("div");
    rowCell.classList.add(`row-cell`);
    cellContent = document.createElement("div");
    cellContent.classList.add(`cell-content-expand`);
    cellContent.setAttribute("id", `cell-content-expand-${i}`);
    cellContent.innerHTML = `<div class="expand"><i id="expand-symbol-${i}" class="fa-solid fa-chevron-down"></i></div>`;
    rowCell.appendChild(cellContent);
    boxRowMain.appendChild(rowCell);

    boxRow.appendChild(boxRowMain);
    boxRowSub.appendChild(boxRowSubLabel);
    boxRowSub.appendChild(boxRowSubContent);
    boxRow.appendChild(boxRowSub);
    box.appendChild(boxRow);
  }
  boxContainer.appendChild(box);
}

async function fetchData() {
  try {
    const response = await fetch("https://api.coincap.io/v2/assets");
    const responseData = await response.json();
    let cryptoObjects = responseData.data.map(
      (item) =>
        new CryptoCurrency(
          item.id,
          item.rank,
          item.symbol,
          item.name,
          setPrecision(item.supply, 0),
          setPrecision(item.maxSupply, 0),
          setPrecision(item.marketCapUsd, 0),
          setPrecision(item.volumeUsd24Hr, 0),
          setPrecision(item.priceUsd, 6),
          setPrecision(item.changePercent24Hr, 2),
          setPrecision(item.vwap24Hr, 2),
          item.explorer
        )
    );

    return cryptoObjects;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

function setPrecision(value, precision = 2) {
  try {
    if (value != undefined && value !== "") {
      return parseFloat(value).toFixed(precision);
    } else {
      return 0;
    }
  } catch (error) {
    console.error("Error rounding value:", error);
    return 0;
  }
}

function createHeader() {
  let boxContainer = document.getElementById("box-container");
  let header = document.createElement("div");
  header.setAttribute("id", "box-header");
  const propNames = [
    "",
    "rank",
    "symbol",
    "name",
    "price",
    "changePercent24Hr",
    "marketCapUsd",
    "",
  ];
  const headerCellNames = [
    "",
    "rank",
    "symbol",
    "name",
    "price",
    "24h(%)",
    "capitalization",
    "",
  ];
  for (i = 0; i < propNames.length; i++) {
    let headerCell = document.createElement("div");
    headerCell.classList.add(`header-cell`);
    headerCell.setAttribute("id", `header-cell-${propNames[i]}`);
    headerCell.innerText = `${headerCellNames[i]}`;
    header.appendChild(headerCell);
  }

  calculateActionBarPositionDynamicallyEvent(header);
  boxContainer.appendChild(header);
}

function setPriceChangeColor() {
  let elements = document.getElementsByClassName(
    "cell-content-changePercent24Hr"
  );
  for (let i = 0; i < elements.length; i++) {
    if (elements[i].innerText > 0) elements[i].classList.add("green");
    else if (elements[i].innerText < 0) elements[i].classList.add("red");
    else elements[i].classList.add("orange");
  }
}

function evenPriceChangeAlign() {
  let elements = document.getElementsByClassName(
    "cell-content-changePercent24Hr"
  );
  for (let i = 0; i < elements.length; i++) {
    if (elements[i].innerText > 0) {
      elements[i].textContent = "\xa0" + elements[i].innerText;
    }
  }
}

function assignEventToFavIcons() {
  const favIcons = document.getElementsByClassName("cell-content-fav");
  const favIconColorUnmarked = getComputedStyle(
    document.documentElement
  ).getPropertyValue("--fav-icon-color-unmarked");
  const favIconColorMarked = getComputedStyle(
    document.documentElement
  ).getPropertyValue("--fav-icon-color-marked");
  for (let i = 0; i < favIcons.length; i++) {
    favIcons[i].addEventListener("click", () => {
      if (
        favIcons[i].style.color === favIconColorUnmarked ||
        favIcons[i].style.color === ""
      ) {
        favIcons[i].style.color = favIconColorMarked;
      } else {
        favIcons[i].style.color = favIconColorUnmarked;
      }
    });
  }
}

function createActionBar() {
  let boxContainer = document.getElementById("box-container");
  let actionBar = document.createElement("div");
  actionBar.setAttribute("id", "action-bar");
  const actionNames = [
    ["Refresh Rates"],
    ["Favourite"],
    ["Sort Price (DESC)"],
    ["USD", "EUR"],
  ];
  for (i = 0; i < actionNames.length; i++) {
    let actionBarCell = document.createElement("div");
    actionBarCell.classList.add(`action-bar-cell`);
    actionBarCell.setAttribute("id", `action-bar-cell-${i}`);
    if (actionNames[i].length === 1) {
      actionBarCell.innerHTML = `<button class="action-bar-cell-button">${actionNames[i]}</button>`;
    } else {
      let button;
      actionNames[i].forEach((x) => {
        button = document.createElement("button");
        button.innerText = `${x}`;
        button.classList.add("action-bar-cell-toggle");
        button.setAttribute("id", `toggle-${x}`);
        actionBarCell.appendChild(button);
      });
    }

    actionBar.appendChild(actionBarCell);
  }
  boxContainer.appendChild(actionBar);
}

function assignEventToFavourites() {
  let favButton = document.querySelector("#action-bar-cell-1 > button");
  favButton.addEventListener("click", () => {
    const rows = document.querySelectorAll(".box-row");
    Array.from(rows).forEach((x) => {
      const favIcon = x.querySelector(".row-cell > .cell-content-fav");
      let favIconStyles = window.getComputedStyle(favIcon);
      if (favIconStyles.color !== "rgb(255, 0, 0)") {
        x.style.display = "none";
      }
    });
  });
}

function assignShowHideRowSubContent() {
  let boxRows = document.querySelectorAll(".box-row");

  Array.from(boxRows).forEach((x) => {
    let subContentRow = x.querySelector(".box-row-sub");
    subContentRow.style.display = "none";

    let arrowButton = x.querySelector(".expand");
    arrowButton.addEventListener("click", () => {
      if (subContentRow.style.display == "none") {
        subContentRow.style.display = "flex";
        arrowButton.innerHTML =
          '<i id="expand-symbol-${i}" class="fa-solid fa-chevron-up">';
      } else {
        subContentRow.style.display = "none";
        arrowButton.innerHTML =
          '<i id="expand-symbol-${i}" class="fa-solid fa-chevron-down">';
      }
    });
  });
}

function clearTable() {
  let rateContainer = document.getElementById("rate-container");
  rateContainer.remove();
  let header = document.getElementById("box-header");
  header.remove();
}

function assignRefreshRatesEvent() {
  let refreshButton = document.querySelector(".action-bar-cell-button");

  refreshButton.addEventListener("click", async () => {
    let toggleBtnUsd = document.getElementById("toggle-USD");
    let toggleBtnEur = document.getElementById("toggle-EUR");
    toggleBtnUsd.style.color = "#f2f2f2";
    toggleBtnUsd.style.backgroundColor = "rgb(5, 110, 255)";
    toggleBtnEur.style.backgroundColor = "#f2f2f2";
    toggleBtnEur.style.color = "rgb(5, 110, 255)";

    let header = document.getElementById("box-header");
    header.style.display = "none";
    clearTable();
    fetchData().then((data) => {
      createHeader();
      createTableContent(data);
      assignEventToFavIcons();
      assignEventToFavourites();
      assignShowHideRowSubContent();
      evenPriceChangeAlign();
      setPriceChangeColor();
    });
  });
}

function toggleCurrency() {
  let toggleBtnEur = document.getElementById("toggle-EUR");
  let toggleBtnUsd = document.getElementById("toggle-USD");
  let prices;
  let capitalization;

  toggleBtnEur.addEventListener("click", () => {
    if (
      getComputedStyle(toggleBtnEur).backgroundColor === "rgb(242, 242, 242)"
    ) {
      prices = document.getElementsByClassName("cell-content-price");
      capitalization = document.getElementsByClassName(
        "cell-content-marketCapUsd"
      );
      Array.from(prices).forEach((x) => {
        x.innerText = (parseFloat(x.innerText) * 0.9).toFixed(6);
      });
      Array.from(capitalization).forEach((x) => {
        x.innerText = (parseFloat(x.innerText) * 0.9).toFixed(0);
      });
      toggleBtnEur.style.color = "#f2f2f2";
      toggleBtnEur.style.backgroundColor = "rgb(5, 110, 255)";
      toggleBtnUsd.style.backgroundColor = "#f2f2f2";
      toggleBtnUsd.style.color = "rgb(5, 110, 255)";
    }
  });

  toggleBtnUsd.addEventListener("click", () => {
    if (
      getComputedStyle(toggleBtnUsd).backgroundColor === "rgb(242, 242, 242)"
    ) {
      prices = document.getElementsByClassName("cell-content-price");
      capitalization = document.getElementsByClassName(
        "cell-content-marketCapUsd"
      );
      Array.from(prices).forEach((x) => {
        x.innerText = (parseFloat(x.innerText) / 0.9).toFixed(6);
      });
      Array.from(capitalization).forEach((x) => {
        x.innerText = (parseFloat(x.innerText) / 0.9).toFixed(0);
      });
      toggleBtnUsd.style.color = "#f2f2f2";
      toggleBtnUsd.style.backgroundColor = "rgb(5, 110, 255)";
      toggleBtnEur.style.backgroundColor = "#f2f2f2";
      toggleBtnEur.style.color = "rgb(5, 110, 255)";
    }
  });
}

function assignPriceSorting() {
  let sortingButton = document.querySelector("#action-bar-cell-2 > button");

  sortingButton.addEventListener("click", () => {
    let prices = document.querySelectorAll(".box-row");
    let sortedArray;
    let pricesArray = [];

    prices = Array.from(prices).filter(
      (x) => getComputedStyle(x).display !== "none"
    );

    Array.from(prices).forEach((x) => {
      pricesArray.push([
        x.cloneNode(true),
        x.querySelector(".cell-content-price").textContent,
      ]);
    });

    if (sortingButton.innerText === "Sort Price (DESC)") {
      sortingButton.innerText = "Sort Price (ASC)";
      sortedArray = pricesArray.sort((a, b) => b[1] - a[1]);
      changeArrayOrder(prices, sortedArray);
    } else {
      sortingButton.innerText = "Sort Price (DESC)";
      sortedArray = pricesArray.sort((a, b) => a[1] - b[1]);
      changeArrayOrder(prices, sortedArray);
    }

    assignShowHideRowSubContent();
    assignEventToFavIcons();
  });
}

function changeArrayOrder(baseData, sortedData) {
  for (let i = 0; i < baseData.length; i++) {
    for (let i = 0; i < baseData.length; i++) {
      while (baseData[i].firstChild) {
        baseData[i].removeChild(baseData[i].firstChild);
      }
    }
  }

  for (let i = 0; i < baseData.length; i++) {
    while (baseData[i].firstChild) {
      baseData[i].removeChild(baseData[i].firstChild);
    }

    let children = sortedData[i][0].childNodes;
    children.forEach((child) => {
      baseData[i].appendChild(child.cloneNode(true));
    });
  }
}

function createBoxShadow() {
  const app = document.getElementById("app-root");
  let boxShadow = document.createElement("div");
  boxShadow.setAttribute("id", "box-shadow");
  app.appendChild(boxShadow);
}

function createBoxContainer() {
  let boxContainer = document.createElement("div");
  boxContainer.setAttribute("id", "box-container");
  let boxShadow = document.getElementById("box-shadow");
  boxShadow.appendChild(boxContainer);
}

function calculateActionBarPositionDynamicallyEvent(item) {
  let actionBar = document.getElementById("action-bar");
  item.style.top = actionBar.offsetHeight + "px";
  addEventListener("resize", () => {
    item.style.top = actionBar.offsetHeight + "px";
  });
}

function main() {
  createBoxShadow();
  createBoxContainer();
  displayMain();
}

async function createCryptoTable() {
  fetchData().then((data) => {
    createTableContent(data);
    setPriceChangeColor();
    assignEventToFavIcons();
    assignEventToFavourites();
    assignShowHideRowSubContent();
    evenPriceChangeAlign();
  });

  assignRefreshRatesEvent();
  toggleCurrency();
  assignPriceSorting();
}

async function displayMain() {
  createActionBar();
  createHeader();
  await createCryptoTable();
}

main();
