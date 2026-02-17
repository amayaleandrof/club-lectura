// Configuración: lista de extensiones de imagen soportadas
const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];

// Generar nombres del 01 al 99 automáticamente
const imageFiles = [];
for (let i = 1; i <= 99; i++) {
    // Formato con cero: 01, 02, ..., 09, 10, 11...
    imageFiles.push(i.toString().padStart(2, '0'));
}

let currentImageIndex = 0;
let loadedImages = [];

// Detectar imágenes automáticamente
async function detectImages() {
    const gallery = document.getElementById('gallery');
    const extensions = ['jpg', 'jpeg', 'png', 'webp'];
    
    // Intentar cargar cada combinación de número + extensión
    for (let file of imageFiles) {
        for (let ext of extensions) {
            const img = new Image();
            const src = `images/${file}.${ext}`;
            img.src = src;
            
            try {
                await new Promise((resolve) => {
                    img.onload = () => resolve(true);
                    img.onerror = () => resolve(false);
                    setTimeout(() => resolve(false), 300); // timeout rápido
                }).then(exists => {
                    if (exists) {
                        loadedImages.push({
                            src: src,
                            name: `${file}.${ext}`
                        });
                    }
                });
            } catch(e) {}
        }
    }
    
    // Si no se encontraron imágenes, mostrar mensaje
    if (loadedImages.length === 0) {
        gallery.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: #888;">
                <h3>No se encontraron imágenes</h3>
                <p>Agrega tus fotos a la carpeta <code>images/</code> y actualiza la página.</p>
                <p style="margin-top: 1rem; font-size: 0.9rem;">
                    Asegúrate de que tus archivos estén nombrados como: 01.jpg, 02.jpg, etc.
                </p>
            </div>
        `;
        return;
    }
    
    // Ordenar numéricamente (01, 02, 03... en lugar de alfabéticamente)
    loadedImages.sort((a, b) => {
        const numA = parseInt(a.name.match(/\d+/)[0]);
        const numB = parseInt(b.name.match(/\d+/)[0]);
        return numA - numB;
    });
    
    // Renderizar galería
    renderGallery();
}

function renderGallery() {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';
    
    loadedImages.forEach((image, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-item loading';
        item.onclick = () => openLightbox(index);
        
        const img = document.createElement('img');
        img.src = image.src;
        img.alt = image.name;
        img.loading = 'lazy'; // Lazy loading para performance
        
        img.onload = () => {
            item.classList.remove('loading');
        };
        
        item.appendChild(img);
        gallery.appendChild(item);
    });
}

// Lightbox functions
function openLightbox(index) {
    currentImageIndex = index;
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const caption = document.getElementById('caption');
    
    lightbox.style.display = 'block';
    lightboxImg.src = loadedImages[index].src;
    caption.textContent = loadedImages[index].name;
    
    document.body.style.overflow = 'hidden'; // Prevenir scroll
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function changeImage(direction) {
    currentImageIndex += direction;
    
    if (currentImageIndex >= loadedImages.length) {
        currentImageIndex = 0;
    } else if (currentImageIndex < 0) {
        currentImageIndex = loadedImages.length - 1;
    }
    
    const lightboxImg = document.getElementById('lightbox-img');
    const caption = document.getElementById('caption');
    
    lightboxImg.style.opacity = '0';
    setTimeout(() => {
        lightboxImg.src = loadedImages[currentImageIndex].src;
        caption.textContent = loadedImages[currentImageIndex].name;
        lightboxImg.style.opacity = '1';
    }, 200);
}

// Event listeners
document.querySelector('.close').onclick = closeLightbox;

document.getElementById('lightbox').onclick = (e) => {
    if (e.target.id === 'lightbox') closeLightbox();
};

// Navegación con teclado
document.addEventListener('keydown', (e) => {
    const lightbox = document.getElementById('lightbox');
    if (lightbox.style.display === 'block') {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') changeImage(-1);
        if (e.key === 'ArrowRight') changeImage(1);
    }
});

// Iniciar cuando carga la página
window.addEventListener('DOMContentLoaded', detectImages);