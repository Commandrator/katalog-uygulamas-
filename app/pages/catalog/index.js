// Son Düzenleme: 31 Aralık 2024
// Author: Talha Yaşar <talha_6152@hotmail.com>
let root = document.getElementById("root");
let nav = document.getElementById("navigator");

const series = [];
const productData = [];
let filteredProducts = [];
let clientConfig = {api:{series:"",products:""},navData:{"title":"Title","subTitle":"SubTitle", "searchBox":{"placeholder":"Search Box Placeholder"}}};
class Div {
  constructor(child = null) {
    this.div = document.createElement("div");
    if (child) {
      this.div.appendChild(child);
    }
  }
  addClass(className) {
    this.div.classList.add(className);
  }
  addStyle(styles) {
    Object.assign(this.div.style, styles);
  }
  getElement() {
    return this.div;
  }
  static createDiv(child = null) {
    let div = document.createElement("div");
    if (child) {
      div.appendChild(child);
    }
    return div;
  }
}
class Input {
  constructor(type = "text", placeholder = "") {
    this.input = document.createElement("input");
    this.input.type = type;
    this.input.placeholder = placeholder;
  }
  setValue(value) {
    this.input.value = value;
  }
  setStyle(styles) {
    Object.assign(this.input.style, styles);
  }
  getValue() {
    return this.input.value;
  }
  getElement() {
    return this.input;
  }
  static createInput(type = "text", placeholder = "") {
    let input = document.createElement("input");
    input.type = type;
    input.placeholder = placeholder;
    return input;
  }
}
class Hr {
  constructor() {
    this.hr = document.createElement("hr");
  }
  setStyle(styles) {
    Object.assign(this.hr.style, styles);
  }
  getElement() {
    return this.hr;
  }
  static createHr() {
    return document.createElement("hr");
  }
}
class H1 {
  constructor(text = "") {
    this.h1 = document.createElement("h1");
    if (text) {
      this.h1.textContent = text;
    }
  }
  setText(text) {
    this.h1.textContent = text;
  }
  addClass(className) {
    this.h1.classList.add(className);
  }
  setStyle(styles) {
    Object.assign(this.h1.style, styles);
  }
  getElement() {
    return this.h1;
  }
  static createH1(text = "") {
    let h1 = document.createElement("h1");
    h1.textContent = text;
    return h1;
  }
}
class H2 {
  constructor(text = "") {
    this.h2 = document.createElement("h2");
    if (text) {
      this.h2.textContent = text;
    }
  }
  setText(text) {
    this.h2.textContent = text;
  }
  addClass(className) {
    this.h2.classList.add(className);
  }
  setStyle(styles) {
    Object.assign(this.h2.style, styles);
  }
  getElement() {
    return this.h2;
  }
  static createH2(text = "") {
    let h2 = document.createElement("h2");
    h2.textContent = text;
    return h2;
  }
}
document.addEventListener("DOMContentLoaded", async () => {
  root.innerHTML = `<p>Yükleniyor...</p>`;  
  try {
    clientConfig = JSON.parse(await (await fetch("http://localhost:5929/client-config")).json());
    const watermark = document.createElement('div');
    watermark.textContent = 'TALHA YAŞAR';
    watermark.style.position = 'fixed';
    watermark.style.top = '50%';
    watermark.style.left = '50%';
    watermark.style.transform = 'translate(-50%, -50%)';
    watermark.style.fontSize = '6rem';
    watermark.style.color = 'rgba(0, 0, 0, 0.5)';
    watermark.style.pointerEvents = 'none';
    watermark.style.zIndex = '9999';
    document.body.appendChild(watermark);
    createNavigator(clientConfig.navData);
    let seriesResponse = await fetch(clientConfig.api.series);
    if (!seriesResponse.ok) throw new Error(`Ürün seri Api'ında hata ile karşılaşıldı: ${seriesResponse.statusText}`);
    series.push(...(await seriesResponse.json()));
    let productDataResponse = await fetch(clientConfig.api.products);
    if (!productDataResponse.ok) throw new Error(`Ürün Api'ında hata ile karşılaşıldı: ${productDataResponse.statusText}`);
    productData.push(...(await productDataResponse.json()));
    root.innerHTML = "";
    createCatalog(productData, series);
  } catch (error) {
    root.innerHTML = `<p>Error: ${error.message}</p>`;
  }
});
const searchBox = (data) => {
  let input = new Input("text", data.placeholder);
  input.setStyle({
    fontSize: "20px",
    padding: "4px",
    height: "40px",
    width: "400px",
    borderRadius: "10px",
    paddingLeft: "30px",
  });
  let div = new Div();
  div.getElement().appendChild(input.getElement());
  div.addStyle({ position: "relative" });
  input.getElement().addEventListener("input", (event) => updateResults(event.target.value));
  input.getElement().addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      resultDiv.getElement().style.display = "none";
      root.innerHTML = "";
      if (input.getElement().value === "") filteredProducts = productData;
      createCatalog(filteredProducts, series);
    }
  });
  let resultDiv = new Div();
  resultDiv.addStyle({
    position: "fixed",
    top: "70px",
    right: "0",
    maxHeight: "400px",
    zIndex: "100",
    overflowY: "auto",
    width: "400px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "10px",
    padding: "10px",
    display: "none",
    marginRight: "15px",
  });
  let listDiv = document.createElement("div");
  listDiv.style.marginTop = "10px";
  resultDiv.getElement().appendChild(listDiv);
  const updateResults = (query) => {
    if (query === "") resultDiv.getElement().style.display = "none";
    else {
      resultDiv.getElement().style.display = "block";
      filteredProducts = productData.filter((product) =>
          product.categori.toLowerCase().includes(query.toLowerCase()) ||
          product.products.toLowerCase().includes(query.toLowerCase()) ||
          product.subCategori.toLowerCase().includes(query.toLowerCase())
      );
      listDiv.innerHTML = "";
      if (filteredProducts.length > 0) {
        filteredProducts.slice(0, 10).forEach((product) => {
          let listItem = document.createElement("div");
          listItem.textContent = product.products;
          listItem.style.padding = "8px";
          listItem.style.borderBottom = "1px solid #ddd";
          listItem.style.cursor = "pointer";
          listItem.addEventListener("click", () => {
            input.setValue(product.products);              // Tıklanan değeri input'a ekle
            updateResults("");                             // Arama sonuçlarını sıfırla
            root.innerHTML = "";
            createCatalog([product], series);
          });
          listDiv.appendChild(listItem);
        });
      } else {
        let noResults = document.createElement("div");
        noResults.textContent = "Sonuç Bulunamadı";
        noResults.style.padding = "8px";
        noResults.style.color = "#888";
        listDiv.appendChild(noResults);
      }
    }
  };
  document.addEventListener("click", (event) => {
    if (!resultDiv.getElement().contains(event.target) && !div.getElement().contains(event.target))
      resultDiv.getElement().style.display = "none";
  });
  document.body.appendChild(resultDiv.getElement());
  return div.getElement();
};
const createNavigator = (data) => {                           // Navigatör oluşturma fonksiyonu
  let div = new Div();
  div.addStyle({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "fixed",
    top: "0",
    left: "0",
    right: "0",
    backgroundColor: "#fff",
    zIndex: "100",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    padding: "5px 20px",
    margin: "0",
    transition: "top 0.3s ease",
  });
  let productInfoDiv = new Div();
  productInfoDiv.addStyle({
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  });
  productInfoDiv
    .getElement()
    .appendChild(new H1(data.title).getElement());
  let path = new H2(data.subTitle);
  path.setStyle({ fontSize: "18px", marginTop: "-10px", color: "#5d5d5d" });
  productInfoDiv.getElement().appendChild(path.getElement());
  let getElement = div.getElement();
  getElement.appendChild(productInfoDiv.getElement());
  getElement.appendChild(searchBox(data.searchBox));
  nav.appendChild(getElement);
  document.body.style.paddingTop = "100px";
  let lastScrollTop = 0;
  let navBar = div.getElement();
  window.addEventListener("scroll", () => {
    let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    if (currentScroll > lastScrollTop && currentScroll > 100) navBar.style.top = "-120px";
    else if (currentScroll < lastScrollTop) navBar.style.top = "0";
    if (currentScroll <= 0) navBar.style.top = "0";
    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  });
};
const capitalizeFirstLetter = (str) =>
  str.length > 0 ? str[0].toUpperCase() + str.slice(1) : str;
const filteredBySeries = (brandModels, series) => {
  let seriesTemp = [];
  series.forEach((seriesData) => {
    const seriesName = seriesData.series;
    const filteredModels = brandModels.filter((model) => model.products.includes(seriesName));
    if (filteredModels.length > 0) seriesTemp.push({ products: filteredModels, ...seriesData });
  });
  return seriesTemp;
};
const createCatalog = async (data, series) => {           // Kataloğun Oluşturulması
  const groupedByBrand = Object.groupBy(data, ({ brand }) => brand);
  const groupedByCategory = Object.keys(groupedByBrand).map((key) => ({brand: key, group: Object.groupBy(groupedByBrand[key], ({ categori }) => categori)}));
  let brandDivGroup = new Div().getElement();
  brandDivGroup.style.paddingLeft = "10px";
  let hr = new Hr().getElement();
  for (let brand of groupedByCategory) {
    let brandDiv = new Div().getElement();
    brandDiv.id = brand.brand;                            // Marka id
    brandDiv.classList.add("product-brand");
    let categoryDivGroup = new Div().getElement();
    for (let categori of Object.keys(brand.group)) {
      let categoryDiv = new Div().getElement();
      categoryDiv.style.padding = "10px";
      categoryDiv.id = categori;                          // Kategori id'si
      categoryDiv.classList.add("product-category");
      let categoryTitle = new H1(`${brand.brand}\\${categori}`.toUpperCase()).getElement();
      categoryDiv.appendChild(categoryTitle);
      categoryDiv.appendChild(hr);
      let brandModels = Object.groupBy(brand.group[categori],({ subCategori }) => subCategori);
      for (let models of Object.keys(brandModels)) {
        let modelDiv = new Div().getElement();
        modelDiv.style.padding = "10px";
        modelDiv.id = `model-${models}`; // Benzersiz id
        modelDiv.classList.add("product-models");
        let modelTitle = new H1(`${models.toUpperCase()} Model Ürünler`).getElement();
        modelDiv.appendChild(modelTitle);
        const productsWithSeriesData = filteredBySeries(brandModels[models],series);
        let seriesDiv = new Div().getElement();
        seriesDiv.style.display = "flex";
        seriesDiv.style.backgroundColor = "#D9D9D9";
        seriesDiv.style.backgroundColor = "#D9D9D9";
        seriesDiv.style.overflow = "auto";
        seriesDiv.style.justifyContent = "start";
        seriesDiv.style.borderRadius = "10px";
        seriesDiv.style.padding = "10px";
        productsWithSeriesData.forEach((item) => {
          let seriesCardDiv = new Div().getElement();
          seriesCardDiv.classList.add("product");
          seriesCardDiv.style.border = "1px solid #ccc";
          seriesCardDiv.style.borderRadius = "8px";
          seriesCardDiv.style.margin = "10px";
          seriesCardDiv.style.padding = "10px";
          seriesCardDiv.style.backgroundColor = "#333";
          seriesCardDiv.style.color = "white";
          seriesCardDiv.style.display = "flex";
          seriesCardDiv.style.flexDirection = "column";
          seriesCardDiv.style.minwidth = "400px";
          let productInfoDiv = new Div().getElement();
          productInfoDiv.style.display = "flex";
          productInfoDiv.style.justifyContent = "space-between";
          productInfoDiv.style.alignItems = "start";
          productInfoDiv.style.marginBottom = "10px";
          let titleDiv = new Div().getElement();
          let seriesTitle = new H1(item.series).getElement();
          seriesTitle.style.margin = "5px";
          let seriesType = new H2(item.type).getElement();
          seriesType.style.margin = "0px";
          titleDiv.appendChild(seriesTitle);
          titleDiv.appendChild(seriesType);
          let seriesYears = new H1(item.year).getElement();
          seriesYears.style.margin = "0px";
          productInfoDiv.appendChild(titleDiv);
          productInfoDiv.appendChild(seriesYears);
          seriesCardDiv.appendChild(productInfoDiv);
          let contentDiv = new Div().getElement();
          contentDiv.style.display = "flex";
          contentDiv.style.justifyContent = "space-between";
          let productListDiv = new Div().getElement();
          productListDiv.style.marginRight = "20px";
          productListDiv.style.minWidth = "200px";
          item.products.forEach((model) => {
            let modelList = document.createElement("ul");
            modelList.style.listStyleType = "none";
            modelList.style.paddingLeft = "0";
            modelList.style.padding = "10px";
            modelList.style.borderRadius = "8px";
            modelList.style.backgroundColor = "#f9f9f9";
            modelList.style.color = "black";
            modelList.style.width = "200px";
            let modelItem = document.createElement("li");
            modelItem.textContent = `Model: ${model.products}`;
            modelItem.style.fontWeight = "bold";
            modelItem.style.marginBottom = "5px";
            modelList.appendChild(modelItem);
            let listPriceItem = document.createElement("li");
            listPriceItem.textContent = `Liste Fiyatı: ${model.listPrice ? model.listPrice : "-"}`;
            listPriceItem.style.fontWeight = "bold";
            listPriceItem.style.marginBottom = "5px";
            modelList.appendChild(listPriceItem);
            let priceItem = document.createElement("li");
            priceItem.textContent = `Fiyat: ${model.Price ? model.Price : "-"}`;
            priceItem.style.fontWeight = "bold";
            priceItem.style.marginBottom = "5px";
            modelList.appendChild(priceItem);
            productListDiv.appendChild(modelList);
          });
          let featuresDiv = new Div().getElement();
          featuresDiv.style.backgroundColor = "#f9f9f9";
          featuresDiv.style.color = "black";
          featuresDiv.style.padding = "10px";
          featuresDiv.style.borderRadius = "8px";
          featuresDiv.style.minWidth = "250px";
          featuresDiv.style.marginTop = "16px";
          featuresDiv.style.maxWidth = "300px";
          let featuresTitle = new H1("Özellikler").getElement();
          featuresDiv.appendChild(featuresTitle);
          let featuresList = document.createElement("ul");
          featuresList.style.listStyleType = "none";
          featuresList.style.paddingLeft = "0";
          featuresList.style.marginTop = "10px";
          featuresList.style.color = "black";
          item.features.forEach((feature) => {
            let featureItem = document.createElement("li");
            featureItem.textContent = feature;
            featuresList.appendChild(featureItem);
          });
          featuresDiv.appendChild(featuresList);
          contentDiv.appendChild(productListDiv);
          if (item.features.length) contentDiv.appendChild(featuresDiv);
          seriesCardDiv.appendChild(contentDiv);
          seriesDiv.appendChild(seriesCardDiv);
        });
        modelDiv.appendChild(seriesDiv);
        categoryDiv.appendChild(modelDiv);
      }
      categoryDivGroup.appendChild(categoryDiv);
    }
    brandDiv.appendChild(categoryDivGroup);
    brandDivGroup.appendChild(brandDiv);
  }
  root.appendChild(brandDivGroup);
};