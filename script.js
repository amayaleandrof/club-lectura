const imageFiles = [];
for (let i = 1; i <= 99; i++) {
    imageFiles.push(i.toString().padStart(2, '0'));
}

let currentImageIndex = 0;
let loadedImages = [];

async function detectImages() {
    const gallery = document.getElementById('gallery');
    const extensions = ['jpg', 'jpeg', 'png', 'webp'];
    
    gallery.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: #666;">Cargando imágenes...</div>';
    
    for (let file of imageFiles) {
        for (let ext of extensions) {
            const src = `./images/${file}.${ext}`;
            
            try {
                const exists = await checkImage(src);
                if (exists) {
                    loadedImages.push({
                        src: src,
                        name: `${file}.${ext}`,
                        number: parseInt(file)
                    });
                }
            } catch(e) {}
        }
    }
    
    if (loadedImages.length === 0) {
        gallery.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: #666;">
                <p>No se encontraron imágenes en la carpeta images/</p>
            </div>
        `;
        return;
    }
    
    // Orden numérico correcto: 01, 02, 03... 10, 11...
    loadedImages.sort((a, b) => a.number - b.number);
    
    renderGallery();
}

function checkImage(src) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = src;
        setTimeout(() => resolve(false), 1000);
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
        
        item.appendChild(img);
        gallery.appendChild(item);
    });
}

function openLightbox(index) {
    currentImageIndex = index;
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const caption = document.getElementById('caption');
    
    lightbox.style.display = 'block';
    lightboxImg.src = loadedImages[index].src;
    caption.textContent = `${index + 1} / ${loadedImages.length}`;
    
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
        caption.textContent = `${currentImageIndex + 1} / ${loadedImages.length}`;
        lightboxImg.style.opacity = '1';
    }, 150);
}

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

window.addEventListener('DOMContentLoaded', detectImages);