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

const cropPanel = document.getElementById("cropPanel");
const cropXInput = document.getElementById("cropX");
const cropYInput = document.getElementById("cropY");
const cropWidthInput = document.getElementById("cropWidth");
const cropHeightInput = document.getElementById("cropHeight");
const cropToggleBtn = document.getElementById("cropToggleBtn");
const applyCropBtn = document.getElementById("applyCropBtn");
const resetCropBtn = document.getElementById("resetCropBtn");

// Image object
let image = null;
let cropRect = null;


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

                cropRect = {
                    x: 0,
                    y: 0,
                    width: image.width,
                    height: image.height
                };

                canvas.width = image.width;
                canvas.height = image.height;

                canvas.style.display = "block";

                emptyState.style.display = "none";

                imageStatus.textContent =
                    file.name;

                downloadBtn.disabled = false;

                updateCropControls();
                cropPanel.classList.remove("hidden");

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

function updateCropControls() {
    if (!image) {
        return;
    }

    const maxX = Math.max(0, image.width - 1);
    const maxY = Math.max(0, image.height - 1);

    cropXInput.max = String(maxX);
    cropYInput.max = String(maxY);
    cropWidthInput.max = String(image.width);
    cropHeightInput.max = String(image.height);

    if (!cropRect) {
        cropRect = {
            x: 0,
            y: 0,
            width: image.width,
            height: image.height
        };
    }

    cropXInput.value = String(cropRect.x);
    cropYInput.value = String(cropRect.y);
    cropWidthInput.value = String(cropRect.width);
    cropHeightInput.value = String(cropRect.height);
}

function getActiveCropRect() {
    if (!image) {
        return null;
    }

    if (!cropRect) {
        return {
            x: 0,
            y: 0,
            width: image.width,
            height: image.height
        };
    }

    return {
        x: Math.min(cropRect.x, image.width - 1),
        y: Math.min(cropRect.y, image.height - 1),
        width: Math.max(1, Math.min(cropRect.width, image.width - cropRect.x)),
        height: Math.max(1, Math.min(cropRect.height, image.height - cropRect.y))
    };
}

function drawMeme() {

    if (!image) {
        return;
    }

    const activeCrop = getActiveCropRect();

    canvas.width = activeCrop.width;
    canvas.height = activeCrop.height;

    // Clear canvas
    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // Draw cropped image
    ctx.drawImage(
        image,
        activeCrop.x,
        activeCrop.y,
        activeCrop.width,
        activeCrop.height,
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

cropToggleBtn.addEventListener("click", function () {
    cropPanel.classList.toggle("hidden");
});

cropXInput.addEventListener("input", function () {
    if (!cropRect) {
        cropRect = { x: 0, y: 0, width: image.width, height: image.height };
    }
    cropRect.x = Number(cropXInput.value);
    drawMeme();
});

cropYInput.addEventListener("input", function () {
    if (!cropRect) {
        cropRect = { x: 0, y: 0, width: image.width, height: image.height };
    }
    cropRect.y = Number(cropYInput.value);
    drawMeme();
});

cropWidthInput.addEventListener("input", function () {
    if (!cropRect) {
        cropRect = { x: 0, y: 0, width: image.width, height: image.height };
    }
    cropRect.width = Number(cropWidthInput.value);
    drawMeme();
});

cropHeightInput.addEventListener("input", function () {
    if (!cropRect) {
        cropRect = { x: 0, y: 0, width: image.width, height: image.height };
    }
    cropRect.height = Number(cropHeightInput.value);
    drawMeme();
});

applyCropBtn.addEventListener("click", function () {
    if (!image) {
        return;
    }

    const nextRect = getActiveCropRect();
    cropRect = nextRect;
    updateCropControls();
    drawMeme();
});

resetCropBtn.addEventListener("click", function () {
    if (!image) {
        return;
    }

    cropRect = {
        x: 0,
        y: 0,
        width: image.width,
        height: image.height
    };

    updateCropControls();
    drawMeme();
});

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
        cropRect = null;
        cropPanel.classList.add("hidden");


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