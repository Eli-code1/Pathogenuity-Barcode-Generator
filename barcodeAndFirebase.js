import JsBarcode from "jsbarcode";
import QRious from "qrious";
export function barcodeAndFirebase(database, ref, get, set, child){

  //setup database
  const db = database;
  const dbRef = ref(database);
  //get aerosolsense barcodes
  function getAerosolSenseBarcodes(){
    get(child(dbRef, `aerosolSense/`)).then((snapshot) => {
    if (snapshot.exists()) {
    var aerosolSenseBarcodes = snapshot.val();
    calculateLatestBarcode(aerosolSenseBarcodes, true, false, false);
    } else {
    console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });
  }
  //get wastewater torpedo barcodes
  function getTorpedoBarcodes(){
    get(child(dbRef, `torpedo/`)).then((snapshot) => {
    if (snapshot.exists()) {
    var torpedoBarcodes =  snapshot.val()
    calculateLatestBarcode(torpedoBarcodes, false, true, false);
    } else {
    console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });
  }
  //get antigen test barcodes
  function getAntigenBarcodes(){
    get(child(dbRef, `antigen/`)).then((snapshot) => {
    if (snapshot.exists()) {
      var antigenBarcodes = snapshot.val();
      antigenTestBarcodes(antigenBarcodes, false);
    } else {
    console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });
  }
  //get bunches of barcodes
  function getAerosolSenseBarcodesBunch(){
    get(child(dbRef, `aerosolSense/`)).then((snapshot) => {
    if (snapshot.exists()) {
    var aerosolSenseBarcodes = snapshot.val();
    calculateLatestBarcode(aerosolSenseBarcodes, true, false, true);
    } else {
    console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });
  }
  //get wastewater torpedo barcodes
  function getTorpedoBarcodesBunch(){
    get(child(dbRef, `torpedo/`)).then((snapshot) => {
    if (snapshot.exists()) {
    var torpedoBarcodes =  snapshot.val()
    calculateLatestBarcode(torpedoBarcodes, false, true, true);
    } else {
    console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });
  }
  //get wastewater torpedo barcodes
  function getAntigenBarcodesBunch(){
    get(child(dbRef, `antigen/`)).then((snapshot) => {
    if (snapshot.exists()) {
    var antigenBarcodes =  snapshot.val()
    antigenTestBarcodes(antigenBarcodes, true);
    } else {
    console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });
  }
  function antigenTestBarcodes(barcodeData, isBunch){
    //write a function that opens the barcode data as a key value pair and finds the latest barcode
    //then it will return the latest barcode
    //the barcodeData array is an array of key value pairs [1: {barcode: "WT0000001"}, 2: {barcode: "WT0000002"}]
    //the value is the barcode
    //the key is the index of the barcode
    if (!isBunch){
      
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      const length = 8;
      let barcode = 'AT';

      // Generate a random barcode
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        barcode += characters[randomIndex];
      }

      // Check if the generated barcode already exists in barcodeData
      const barcodeExists = barcodeData.some((data) => data.barcode === barcode);

      if (barcodeExists) {
        console.log(barcodeExists);
        // Barcode already exists, recursively call the function again
        antigenTestBarcodes(barcodeData, isBunch);
      } else {
        // Barcode is unique, perform your desired operations
        set(ref(db, 'antigen/' + barcodeData.length.toString()), {
          barcode: barcode,
          date: Date.now()
        });
        
        const data = barcode; // Fix: Use 'barcode' instead of 'newBarcode'
        const uploadLink = "https://rat.wisc.edu/?barcode=" + data;
        const qr = new QRious({
          value: uploadLink.toString(),
          size: 150
        });
      

        const img = new Image();
        img.onload = () => {
          const extraSpace = 10; // Add more space below the text
          const fontSize = 15;
          const canvas = document.createElement("canvas");
          canvas.width = qr.size * 2;
          canvas.height = qr.size + extraSpace + fontSize + extraSpace + fontSize + extraSpace; // Increase the height of the canvas
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, (qr.size)/2, 0, canvas.width/2, (canvas.height - (extraSpace*3) - (fontSize*2)))/2;
          const textWidth = ctx.measureText("Not working? Visit rat.wisc.edu").width;
          const x = (canvas.width ) / 2;
          const y = canvas.height - (fontSize / 2); // Position the text
          ctx.font = `${fontSize}px sans-serif`;
          ctx.textAlign = "center";
          ctx.fillText(data, x, y - fontSize - extraSpace);
          ctx.fillText("Not working? Visit rat.wisc.edu", x, y);
          canvas.toBlob((blob) => {
            const link = document.createElement("a");
            link.download = "qrcode.png";
            link.href = URL.createObjectURL(blob);
            link.click();
          });
        };
        img.src = qr.toDataURL();
      }

    
    }
    if (isBunch){
      try{
        document.getElementsByTagName('table')[0].remove();
        document.getElementById("copyButton").remove();
      } catch {
        
      }
      let tableWidth;
      let cellWidth;
      let rowHeight;
      tableWidth = 4 * 2; // total width of the table
      cellWidth = 1.6; // width of each cell
      rowHeight = 2.0; // height of each row

      // create a new table element
      const table = document.createElement("table");
      table.style.borderCollapse = "collapse";
      //this tracks each new barcode that the function makes and adds one, since the pulling happens before the function
      var trackNewBarcodesCreated = 0;
      // add rows to the table
      var rows = 25;
      var columns = 4;
      for (let i = 0; i < rows; i++) {
        const row = document.createElement("tr");
        row.style.height = `${rowHeight}in`;
        console.log("creating");
        // add cells to the row
        for (let j = 0; j < columns; j++) {
            const cell = document.createElement("td");
            cell.style.width = `${cellWidth}in`;
            cell.style.border = "1px solid black";
            cell.style.padding = "10px";
            const image = new Image();
            image.onload = () => {
              image.style.width = `${cellWidth}in`;
              image.style.height = `${rowHeight}in`;
            };
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            const length = 8;
            let barcode = 'AT';

            // Generate a random barcode
            for (let i = 0; i < length; i++) {
              const randomIndex = Math.floor(Math.random() * characters.length);
              barcode += characters[randomIndex];
            }

            // Check if the generated barcode already exists in barcodeData
            const barcodeExists = barcodeData.some((data) => data.barcode === barcode);

            if (barcodeExists) {
              console.log(barcodeExists);
              // Barcode already exists, recursively call the function again
              antigenTestBarcodes(barcodeData, isBunch);
            } else {
              // Barcode is unique, perform your desired operations
              set(ref(db, 'antigen/' + (barcodeData.length + trackNewBarcodesCreated).toString()), {
                barcode: barcode,
                date: Date.now()
              });
              
              const data = barcode;
            const uploadLink = "https://rat.wisc.edu/?barcode=" + data;
            const qr = new QRious({
              value: uploadLink,
              size: 150
            });
            const qrImage = new Image();
            qrImage.onload = () => {
              const extraSpace = 10; // Add more space below the text
              const fontSize = 15;
              const canvas = document.createElement("canvas");
              canvas.width = qr.size * 2;
              canvas.height = qr.size + extraSpace + fontSize + extraSpace + fontSize + extraSpace; // Increase the height of the canvas
              const ctx = canvas.getContext("2d");
              ctx.drawImage(qrImage, (qr.size) / 2, 0, canvas.width / 2, (canvas.height - (extraSpace * 3) - (fontSize * 2)) / 2);
              const textWidth = ctx.measureText("Not working? Visit rat.wisc.edu").width;
              const x = (canvas.width) / 2;
              const y = canvas.height - (fontSize / 2) - 30; // Position the text
              ctx.font = `${fontSize}px sans-serif`;
              ctx.textAlign = "center";
              ctx.fillText("Not working? Visit rat.wisc.edu", x, y);
              // Scale the content horizontally
              ctx.scale(1.35, 1);

              // Measure the width of the data text
              const dataTextWidth = ctx.measureText(data).width;

              // Calculate the centered position for the data text
              const dataX = (canvas.width / 2) / 1.35; // Divide by the scale factor
              const dataY = 100;

              // Fill the scaled and centered data text on the canvas
              ctx.fillText(data, dataX, y - fontSize - 10);

              const barcodeImage = canvas.toDataURL("image/png");
              image.src = barcodeImage;
            };
            qrImage.src = qr.toDataURL();

            cell.appendChild(image);
            row.appendChild(cell);
            trackNewBarcodesCreated++;
          }

          table.appendChild(row);
        }
      }

      // append the table to the document body
      document.body.appendChild(table);

      // create a button to copy the table
      const copyButton = document.createElement("button");
      copyButton.id = "copyButton";
      copyButton.innerText = "Copy Table (Beta)";
      copyButton.onclick = () => {
        const range = document.createRange();
        range.selectNode(table);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand("copy");
        window.getSelection().removeAllRanges();
        alert("Table copied to clipboard!");
      };
      const printButton = document.createElement("button");
      printButton.id = "printButton";
      printButton.innerText = "Print Table";
      printButton.onclick = () => {
        var table = document.getElementsByTagName("table")[0];
        var originalContents = document.body.innerHTML;
        document.body.innerHTML = table.innerHTML;
        window.print();
        document.body.innerHTML = originalContents;
      };
      document.body.appendChild(printButton);

      // append the buttons to the document body
      document.body.appendChild(copyButton);

    }
  }

  function calculateLatestBarcode(barcodeData, isAerosolSense, isTorpedo, isBunch){
  //write a function that opens the barcode data as a key value pair and finds the latest barcode
  //then it will return the latest barcode
  //the barcodeData array is an array of key value pairs [1: {barcode: "WT0000001"}, 2: {barcode: "WT0000002"}]
  //the value is the barcode
  //the key is the index of the barcode
  if (!isBunch){
    //get the last index of the array
    var lastIndex = barcodeData.length - 1;
    //get the last barcode
    var lastBarcode = barcodeData[lastIndex].barcode;
    //get the last barcode number
    //handle if prefix is WT or AE (eg. AE0000001 or WT0000001)

    if (lastBarcode.substring(0, 1) == "AP"){
      var lastBarcodeNumber = lastBarcode.substring(1);
    }
    else{
      var lastBarcodeNumber = lastBarcode.substring(2);
    }
    //convert the last barcode number to an integer
    var lastBarcodeNumberInt = parseInt(lastBarcodeNumber);
    //increment the last barcode number
    var newBarcodeNumber = lastBarcodeNumberInt + 1;
    //add leading zeros to reach 7 digits
    newBarcodeNumber = newBarcodeNumber.toString().padStart(7, "0");
    if (isAerosolSense){
      //add leading zeros to reach 12 digits
       newBarcodeNumber = newBarcodeNumber.toString().padStart(12, "0");
    }
    //convert the new barcode number to a string
    var newBarcodeNumberString = newBarcodeNumber.toString();
    if (isTorpedo){
      //add the "WT" to the front of the new barcode number
      var newBarcode = "WT" + newBarcodeNumberString;

      set(ref(db, 'torpedo/' + (parseInt(lastIndex) + 1).toString()), {
      barcode: newBarcode,
      date: Date.now()
    });
    }
    if (isAerosolSense){
      //add the "AE" to the front of the new barcode number
      var newBarcode = "AP" + newBarcodeNumberString;

      set(ref(db, 'aerosolSense/' + (parseInt(lastIndex) + 1).toString()), {
      barcode: newBarcode,
      date: Date.now()
    });
    }
    const data = newBarcode;
    const canvas = document.createElement("canvas");
    JsBarcode(canvas, data, { format: "CODE128", displayValue: true, fontSize: 12, width: 1, height: 25 });
    canvas.toBlob((blob) => {
      const link = document.createElement("a");
      link.download = "barcode.png";
      link.href = URL.createObjectURL(blob);
      link.click();
    });
  }
  if (isBunch){
    try{
      document.getElementsByTagName('table')[0].remove();
      document.getElementById("copyButton").remove();
    } catch {
      
    }
    let tableWidth;
    let cellWidth;
    let rowHeight;
    tableWidth = 5 * 1.28; // total width of the table
    cellWidth = 1.28; // width of each cell
    rowHeight = .75; // height of each row

    // create a new table element
    const table = document.createElement("table");
    table.style.borderCollapse = "collapse";
    //this tracks each new barcode that the function makes and adds one, since the pulling happens before the function
    var trackNewBarcodesCreated = 0;
    // add rows to the table
    var rows = 17;
    var columns = 5;
    for (let i = 0; i < rows; i++) {
      const row = document.createElement("tr");
      row.style.height = `${rowHeight}in`;
      console.log("creating");
      // add cells to the row
      for (let j = 0; j < columns; j++) {
        const cell = document.createElement("td");
        cell.style.width = `${cellWidth}in`;
        cell.style.border = "1px solid black";
        cell.style.padding = "10px";
        const image = new Image();
        image.onload = () => {
          image.style.width = `${cellWidth}in`;
          image.style.height = `${rowHeight}in`;
        };
        //get the last index of the array
        var lastIndex = barcodeData.length - 1;
        //get the last barcode
        var lastBarcode = barcodeData[lastIndex].barcode;
        //get the last barcode number
        //handle if prefix is WT or AE (eg. AE0000001 or WT0000001)
    
        if (lastBarcode.substring(0, 1) == "AP"){
          var lastBarcodeNumber = lastBarcode.substring(1);
        }
        else{
          var lastBarcodeNumber = lastBarcode.substring(2);
        }
        //convert the last barcode number to an integer
        var lastBarcodeNumberInt = parseInt(lastBarcodeNumber);
        //increment the last barcode number
        var newBarcodeNumber = lastBarcodeNumberInt + 1 + trackNewBarcodesCreated;
        //add leading zeros to reach 7 digits
        newBarcodeNumber = newBarcodeNumber.toString().padStart(7, "0");
        if (isAerosolSense){
          //add leading zeros to reach 12 digits
           newBarcodeNumber = newBarcodeNumber.toString().padStart(12, "0");
        }
        //convert the new barcode number to a string
        var newBarcodeNumberString = newBarcodeNumber.toString();
        if (isTorpedo){
          //add the "WT" to the front of the new barcode number
          var newBarcode = "WT" + newBarcodeNumberString;

          set(ref(db, 'torpedo/' + (parseInt(lastIndex) + 1 + trackNewBarcodesCreated).toString()), {
          barcode: newBarcode,
          date: Date.now()
        });
        }
        if (isAerosolSense){
          //add the "AE" to the front of the new barcode number
          var newBarcode = "AP" + newBarcodeNumberString;

          set(ref(db, 'aerosolSense/' + (parseInt(lastIndex) + 1 + trackNewBarcodesCreated).toString()), {
          barcode: newBarcode,
          date: Date.now()
        });
        }
        const data = newBarcode;
        const canvas = document.createElement("canvas");
        JsBarcode(canvas, data, { format: "CODE128", displayValue: true, fontSize: 12, width: 1, height: 50 });
        const barcodeImage = canvas.toDataURL("image/png");
        image.src = barcodeImage;

        cell.appendChild(image);
        row.appendChild(cell);
        trackNewBarcodesCreated++;
      }

      table.appendChild(row);
    }

    // append the table to the document body
    document.body.appendChild(table);

    // create a button to copy the table
    const copyButton = document.createElement("button");
    copyButton.id = "copyButton";
    copyButton.innerText = "Copy Table";
    copyButton.onclick = () => {
      const range = document.createRange();
      range.selectNode(table);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
      document.execCommand("copy");
      window.getSelection().removeAllRanges();
      alert("Table copied to clipboard!");
    };
    

    // append the buttons to the document body
    document.body.appendChild(copyButton);

  }
  }
  document.getElementById('aerosolSenseBtn').addEventListener('click', getAerosolSenseBarcodes)
  document.getElementById('wastewaterBtn').addEventListener('click', getTorpedoBarcodes)
  document.getElementById('antigenBtn').addEventListener('click', getAntigenBarcodes)
  document.getElementById('aerosolSenseBtnBunch').addEventListener('click', getAerosolSenseBarcodesBunch)
  document.getElementById('wastewaterBtnBunch').addEventListener('click', getTorpedoBarcodesBunch)
  document.getElementById('antigenBtnBunch').addEventListener('click', getAntigenBarcodesBunch)
}