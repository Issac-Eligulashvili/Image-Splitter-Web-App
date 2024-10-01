$(document).ready(function () {
     $('#splitButton').on('click', function () {
          const tileWidth = parseInt($('#tileWidth').val());
          const tileHeight = parseInt($('#tileHeight').val());

          const fileInput = $('#upload')[0];

          const file = fileInput.files[0];

          if (!fileInput.files.length) {
               alert('Please upload an image!')
               return;
          }


          console.log("Uploaded file type:", file.type);
          if (!file.type.startsWith('image/')) {
               alert("Please upload a valid image file.");
               return;
          }



          const reader = new FileReader();

          const img = new Image();

          reader.onload = function (event) {
               img.src = event.target.result;

               img.onload = () => {

                    if (img.width === 0 || img.height === 0) {
                         alert("Image has invalid dimensions.");
                         return;
                    }
                    const canvas = document.getElementById('canvas');
                    const ctx = canvas.getContext('2d');

                    canvas.width = img.width;
                    canvas.height = img.height;

                    ctx.drawImage(img, 0, 0);

                    const rows = Math.ceil(img.height / tileHeight);
                    const columns = Math.ceil(img.width / tileWidth);

                    console.log(rows, columns);

                    let tileId = 0; // Initialize tile ID
                    const zip = new JSZip(); //create the array to store the download links
                    const folder = zip.folder('images');

                    let processedTiles = 0; // Counter for processed tiles
                    const totalTiles = rows * columns; // Total number of tiles

                    for (let row = 0; row < rows; row++) {
                         for (let col = 0; col < columns; col++) {
                              console.log(row, col);

                              //calculte position to extract the tile
                              const sx = col * tileWidth;
                              const sy = row * tileHeight;

                              //create a new image based on the tile extracted
                              const tileCanvas = document.createElement('canvas');
                              console.log(tileCanvas);
                              const tileCtx = tileCanvas.getContext('2d');

                              tileCanvas.width = tileWidth;
                              tileCanvas.height = tileHeight;

                              //draw new image onto the canvas
                              tileCtx.drawImage(canvas, sx, sy, tileWidth, tileHeight, 0, 0, tileWidth, tileHeight);

                              tileCanvas.toBlob(function (blob) {
                                   //Add the image to blob
                                   folder.file(`tile_${tileId}.png`, blob);
                                   tileId++;

                                   processedTiles++

                                   //Check if all tiles are itterated to start download
                                   if (processedTiles === totalTiles) {
                                        zip.generateAsync({ type: "blob" }).then(function (c) {
                                             const link = document.createElement('a');
                                             link.href = URL.createObjectURL(c);
                                             link.download = `tiles.zip`;
                                             document.body.appendChild(link);
                                             link.click();
                                             document.body.removeChild(link);
                                        })
                                   }
                              }, 'image/png');

                         }
                    }

                    //wait for the tiles to finish splitting

               }
          };
          // Read the image file and set the source

          reader.readAsDataURL(file);
     })
})


