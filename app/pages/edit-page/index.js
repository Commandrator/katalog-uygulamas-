const series = [];
const productData = [];
let filteredProducts = [];
document.addEventListener("DOMContentLoaded", async () => {
    try {
      let clientConfig = JSON.parse(await (await fetch("http://localhost:5929/client-config")).json());
      let seriesResponse = await fetch(clientConfig.api.series);
      if (!seriesResponse.ok) throw new Error(`Ürün seri Api'ında hata ile karşılaşıldı: ${seriesResponse.statusText}`);
      series.push(...(await seriesResponse.json()));
      let productDataResponse = await fetch(clientConfig.api.products);
      if (!productDataResponse.ok) throw new Error(`Ürün Api'ında hata ile karşılaşıldı: ${productDataResponse.statusText}`);
      productData.push(...(await productDataResponse.json()));
      runApp();
    } catch (error) {
      root.innerHTML = `<p>Error: ${error.message}</p>`;
    }
});
const runApp = () =>{
    createFiligran()
    createTable()
}
const createFiligran = () => {
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
}
const createTable = () = > {
    
}
