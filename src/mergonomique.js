// Formulaire de contact injecté dans tous les <main>
// Effet non ergonomique : le footer devient rouge, tremble, puis explose et relance la page

document.addEventListener('DOMContentLoaded', () => {
  const mains = document.querySelectorAll('main');

  mains.forEach((main, index) => {
    const section = document.createElement('section');
    section.className = 'contact-footer';

    section.innerHTML = `
      <form class="contact-form" action="#" method="post">
        <h3>Nous contacter</h3>

        <div class="contact-row">
          <label for="contact-nom-${index}">Nom</label>
          <input type="text" id="contact-nom-${index}" name="nom">
        </div>

        <div class="contact-row">
          <label for="contact-prenom-${index}">Prénom</label>
          <input type="text" id="contact-prenom-${index}" name="prenom">
        </div>

        <div class="contact-row">
          <label for="contact-tel-${index}">Numéro de téléphone</label>
          <input type="tel" id="contact-tel-${index}" name="telephone">
        </div>

        <div class="contact-row">
          <label for="contact-email-${index}">Adresse mail</label>
          <input type="email" id="contact-email-${index}" name="email">
        </div>

        <div class="contact-row">
          <label for="contact-message-${index}">Message</label>
          <textarea id="contact-message-${index}" name="message" rows="4"></textarea>
        </div>

        <button type="submit">Envoyer</button>
      </form>
    `;

    main.appendChild(section);

    const form = section.querySelector('.contact-form');   // pour écouter le submit
    const container = section;                            // c'est TOUT le footer qu'on anime

    let clickCount = 0;
    const MAX_CLICKS = 4;  // au 4e clic : explosion + reload

    form.addEventListener('submit', (event) => {
      event.preventDefault(); // on bloque l'envoi classique
      clickCount++;

      // Nettoyage des classes de niveau et de shake sur le footer
      container.classList.remove('level-1', 'level-2', 'level-3', 'shake');

      if (clickCount < MAX_CLICKS) {
        // Niveaux de rouge sur le footer
        if (clickCount === 1) {
          container.classList.add('level-1');
        } else if (clickCount === 2) {
          container.classList.add('level-2');
        } else if (clickCount >= 3) {
          container.classList.add('level-3');
        }

        // Tremblement du footer
        container.classList.add('shake');

        container.addEventListener('animationend', (e) => {
          if (e.animationName === 'formShake') {
            container.classList.remove('shake');
            
          }
        }, { once: true });

      
        if (clickCount==3) {
            container.classList.add('cracking');
        }
        }

      
      
      else {
        // Explosion du footer
        
        container.classList.add('exploding');

        container.addEventListener('animationend', () => {
          window.location.reload();
        }, { once: true });
      }
    });
  });
});
