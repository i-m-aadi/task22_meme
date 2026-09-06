// ================================
// Meme Generator
// ================================


// Canvas
const canvas = document.getElementById("memeCanvas");
const ctx = canvas.getContext("2d");


// Inputs
const imageUpload = document.getElementById("imageUpload");

const topTextInput =
    document.getElementById("topText");

const bottomTextInput =
    document.getElementById("bottomText");

const fontSizeInput =
    document.getElementById("fontSize");

const textColorInput =
    document.getElementById("textColor");

const strokeColorInput =
    document.getElementById("strokeColor");

const strokeWidthInput =
    document.getElementById("strokeWidth");

const fontFamilyInput =
    document.getElementById("fontFamily");


// Display values
const fontSizeValue =
    document.getElementById("fontSizeValue");

const strokeWidthValue =
    document.getElementById("strokeWidthValue");


// Other elements
const downloadBtn =
    document.getElementById("downloadBtn");

const resetBtn =
    document.getElementById("resetBtn");

const emptyState =
    document.getElementById("emptyState");

const imageStatus =
    document.getElementById("imageStatus");


// Image object
let image = null;


// ================================
// Image Upload
// ================================

imageUpload.addEventListener(
    "change",
    function (event) {

        const file = event.target.files[0];

        if (!file) {
            return;
        }


        // Check whether selected file is an image
        if (!file.type.startsWith("image/")) {

            alert("Please select a valid image file.");

            return;
        }


        const reader = new FileReader();


        reader.onload = function (e) {

            image = new Image();


            image.onload = function () {

                // Set canvas size according to image
                canvas.width = image.width;
                canvas.height = image.height;


                canvas.style.display = "block";

                emptyState.style.display = "none";


                imageStatus.textContent =
                    file.name;


                downloadBtn.disabled = false;


                drawMeme();
            };


            image.src = e.target.result;
        };


        reader.readAsDataURL(file);
    }
);


// ================================
// Draw Meme
// ================================

function drawMeme() {

    if (!image) {
        return;
    }


    // Clear canvas
    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // Draw original image
    ctx.drawImage(
        image,
        0,
        0,
        canvas.width,
        canvas.height
    );


    // Get values
    const fontSize =
        Number(fontSizeInput.value);

    const textColor =
        textColorInput.value;

    const strokeColor =
        strokeColorInput.value;

    const strokeWidth =
        Number(strokeWidthInput.value);

    const fontFamily =
        fontFamilyInput.value;


    // Canvas text settings
    ctx.font =
        `bold ${fontSize}px ${fontFamily}`;

    ctx.textAlign = "center";

    ctx.textBaseline = "top";

    ctx.fillStyle = textColor;

    ctx.strokeStyle = strokeColor;

    ctx.lineWidth = strokeWidth;

    ctx.lineJoin = "round";


    // Draw top text
    drawWrappedText(
        topTextInput.value,
        canvas.width / 2,
        20,
        canvas.width - 40,
        fontSize,
        true
    );


    // Draw bottom text
    drawWrappedText(
        bottomTextInput.value,
        canvas.width / 2,
        canvas.height - 20,
        canvas.width - 40,
        fontSize,
        false
    );
}


// ================================
// Wrapped Text
// ================================

function drawWrappedText(
    text,
    x,
    y,
    maxWidth,
    fontSize,
    isTop
) {

    if (!text.trim()) {
        return;
    }


    ctx.font =
        `bold ${fontSize}px ${fontFamilyInput.value}`;


    const words = text.trim().split(/\s+/);

    const lines = [];

    let currentLine = "";


    // Break text into lines
    for (let i = 0; i < words.length; i++) {

        const testLine =
            currentLine === ""
                ? words[i]
                : currentLine + " " + words[i];


        const width =
            ctx.measureText(testLine).width;


        if (width > maxWidth && currentLine !== "") {

            lines.push(currentLine);

            currentLine = words[i];

        } else {

            currentLine = testLine;
        }
    }


    if (currentLine !== "") {
        lines.push(currentLine);
    }


    const lineHeight =
        fontSize * 1.15;


    let startY;


    if (isTop) {

        // Top text
        startY = y;

    } else {

        // Bottom text
        startY =
            canvas.height -
            20 -
            (lines.length * lineHeight);
    }


    // Draw every line
    lines.forEach(function (line, index) {

        const lineY =
            startY + index * lineHeight;


        // Outline
        if (Number(strokeWidthInput.value) > 0) {

            ctx.strokeText(
                line,
                x,
                lineY
            );
        }


        // Fill
        ctx.fillText(
            line,
            x,
            lineY
        );

    });
}


// ================================
// Live Controls
// ================================

topTextInput.addEventListener(
    "input",
    drawMeme
);


bottomTextInput.addEventListener(
    "input",
    drawMeme
);


fontSizeInput.addEventListener(
    "input",
    function () {

        fontSizeValue.textContent =
            fontSizeInput.value;

        drawMeme();
    }
);


textColorInput.addEventListener(
    "input",
    drawMeme
);


strokeColorInput.addEventListener(
    "input",
    drawMeme
);


strokeWidthInput.addEventListener(
    "input",
    function () {

        strokeWidthValue.textContent =
            strokeWidthInput.value;

        drawMeme();
    }
);


fontFamilyInput.addEventListener(
    "change",
    drawMeme
);


// ================================
// Download Meme
// ================================

downloadBtn.addEventListener(
    "click",
    function () {

        if (!image) {

            alert("Please upload an image first.");

            return;
        }


        // Convert canvas to PNG
        const imageURL =
            canvas.toDataURL(
                "image/png"
            );


        // Create temporary download link
        const link =
            document.createElement("a");


        link.href = imageURL;

        link.download =
            "my-meme.png";


        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);
    }
);


// ================================
// Reset
// ================================

resetBtn.addEventListener(
    "click",
    function () {

        // Clear inputs
        imageUpload.value = "";

        topTextInput.value = "";

        bottomTextInput.value = "";


        // Reset controls
        fontSizeInput.value = 48;

        textColorInput.value = "#ffffff";

        strokeColorInput.value = "#000000";

        strokeWidthInput.value = 4;

        fontFamilyInput.value = "Impact";


        // Update labels
        fontSizeValue.textContent = "48";

        strokeWidthValue.textContent = "4";


        // Remove image
        image = null;


        // Clear canvas
        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        canvas.style.display = "none";

        emptyState.style.display = "block";

        imageStatus.textContent =
            "No image selected";

        downloadBtn.disabled = true;
    }
);


// Initially disable download
downloadBtn.disabled = true;