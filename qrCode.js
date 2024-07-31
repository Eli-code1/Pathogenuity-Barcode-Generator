import QRious from "qrious";
export function qrCode(){
  const barcodeType = document.getElementById("barcode-type");
  const barcodeForm = document.getElementById("barcode-form");
  const barcodeLabel = document.getElementById("barcode-label");
  const wastewaterBtn = document.getElementById("wastewaterBtn");
  const poppyBtn = document.getElementById("poppyBtn");
  const antigenBtn = document.getElementById("antigenBtn");
  const qrForm = document.getElementById("qr-form");
  const qrLabel = document.getElementById("qr-label");
  const qrInput = document.getElementById("qr-input");
  const generateQrBtn = document.getElementById("generate-qr");
  const output = document.getElementById("barcode-output");
  var newBarcode = "";
  barcodeType.addEventListener("change", (event) => {
  if (event.target.value === "code128") {
      barcodeForm.style.display = "block";
      barcodeLabel.textContent = "Enter code for sampling device:";
      qrForm.style.display = "none";
  } else if (event.target.value === "qr") {
      qrForm.style.display = "block";
      qrLabel.textContent = "Enter name of AerosolSense sampler:";
      qrInput.style.width = "20%";
      barcodeForm.style.display = "none";
      document.getElementsByTagName("table")[0].remove();
      document.getElementById("copyButton").remove();
      console.log("removed table");
  } else {
      barcodeForm.style.display = "none";
      qrForm.style.display = "none";
  }
  });

  function generateRandomNumber() {
    const max = 9999999;
    const randomNumber = Math.floor(Math.random() * max) + 1;
    const paddedNumber = randomNumber.toString().padStart(7, "0");
    return paddedNumber;
  }

        generateQrBtn.addEventListener("click", () => {
    const name = qrInput.value;
    /* code for poppy sampler barcodes
    const sampCode = generateRandomNumber();
    alert(name + "'s sampler code is " + sampCode + ". Write this down in the Sampler Barcodes Google Sheet.")
    */
    const sampCode = name;
    const qr = new QRious({
      value: sampCode.toString(),
      size: 150
    });
    const img = new Image();
    img.onload = () => {
    const extraSpace = 10; // Add more space below the text
    const fontSize = 35;
    const canvas = document.createElement("canvas");
    canvas.width = qr.size * 2;
    canvas.height = qr.size + extraSpace + fontSize + extraSpace; // Increase the height of the canvas
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, (qr.size)/2, 0, canvas.width/2, (canvas.height - (extraSpace*2) - fontSize))/2;
      const textWidth = ctx.measureText(name).width;
      const x = (canvas.width ) / 2;
      const y = canvas.height - (fontSize / 2); // Position the text
      ctx.font = `${fontSize}px sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText(name, x, y);
    canvas.toBlob((blob) => {
      const link = document.createElement("a");
      link.download = "qrcode.png";
      link.href = URL.createObjectURL(blob);
      link.click();
    });
    };
    img.src = qr.toDataURL();
    qrInput.value = "";
  });
}