// Configuración
const imageFiles = [];
for (let i = 1; i <= 99; i++) {
    imageFiles.push(i.toString().padStart(2, '0'));
}

let currentImageIndex = 0;
let loadedImages = [];

// Detectar imágenes - versión mejorada para GitHub Pages
async function detectImages() {
    const gallery = document.getElementById('gallery');
    const extensions = ['jpg', 'jpeg', 'png', 'webp'];
    
    // Limpiar mensaje de carga
    gallery.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #888;">Cargando imágenes...</div>';
    
    // Intentar cargar cada imagen
    for (let file of imageFiles) {
        for (let ext of extensions) {
            const src = `./images/${file}.${ext}`;
            
            try {
                const exists = await checkImage(src);
                if (exists) {
                    loadedImages.push({
                        src: src,
                        name: `${file}.${ext}`
                    });
                    console.log(`✓ Cargada: ${src}`);
                }
            } catch(e) {
                // Imagen no existe, continuar
            }
        }
    }
    
    // Si no se encontraron imágenes
    if (loadedImages.length === 0) {
        gallery.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: #888;">
                <h3>No se encontraron imágenes</h3>
                <p>Verificá que tus fotos estén en la carpeta <code>images/</code></p>
                <p style="margin-top: 1rem; font-size: 0.9rem;">
                    Formatos soportados: 01.jpg, 02.png, etc.
                </p>
            </div>
        `;
        return;
    }
    
    // Ordenar numéricamente
    loadedImages.sort((a, b) => {
        const numA = parseInt(a.name.match(/\d+/)[0]);
        const numB = parseInt(b.name.match(/\d+/)[0]);
        return numA - numB;
    });
    
    console.log(`Total imágenes cargadas: ${loadedImages.length}`);
    renderGallery();
}

// Función para verificar si una imagen existe
function checkImage(src) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = src;
        
        // Timeout de 2 segundos
        setTimeout(() => resolve(false), 2000);
    });
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
        img.loading = 'lazy';
        
        img.onload = () => {
            item.classList.remove('loading');
        };
        
        img.onerror = () => {
            console.error(`Error cargando: ${image.src}`);
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
    caption.textContent = `${index + 1} / ${loadedImages.length} - ${loadedImages[index].name}`;
    
    document.body.style.overflow = 'hidden';
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
    
    lightboxImg.style.opacity = '0.5';
    setTimeout(() => {
        lightboxImg.src = loadedImages[currentImageIndex].src;
        caption.textContent = `${currentImageIndex + 1} / ${loadedImages.length} - ${loadedImages[currentImageIndex].name}`;
        lightboxImg.style.opacity = '1';
    }, 200);
}

// Event listeners
document.querySelector('.close').onclick = closeLightbox;

document.getElementById('lightbox').onclick = (e) => {
    if (e.target.id === 'lightbox') closeLightbox();
};

document.addEventListener('keydown', (e) => {
    const lightbox = document.getElementById('lightbox');
    if (lightbox.style.display === 'block') {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') changeImage(-1);
        if (e.key === 'ArrowRight') changeImage(1);
    }
});

// Iniciar
window.addEventListener('DOMContentLoaded', detectImages);