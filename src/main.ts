import './style.css'

function startSectionsAnimation(): void {
  const sections = document.querySelectorAll<HTMLElement>('.house-section');
  const arrayFromNodeList = Array.from(sections);
  const shuffledArray = shuffleArray(arrayFromNodeList);

  shuffledArray.forEach((section, index) => {
    setTimeout(() => {
      section.classList.add('is-visible');
    }, index * 500);

    setTimeout(() => {
      section.classList.remove('is-visible');
      section.classList.add('is-invisible');
    }, index * 500 + 4000);

    setTimeout(() => {
      section.classList.remove('is-invisible');
      section.classList.add('is-visible');
    }, index * 500 + 6000);

    setTimeout(() => {
      section.classList.remove('is-visible');
      section.classList.add('is-invisible');
    }, index * 500 + 8000);

    setTimeout(() => {
      section.classList.remove('is-invisible');
      section.classList.add('is-turning');
    }, index * 500 + 10000);
  });
}

function initSectionsAnimationWhenReady(): void {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => startSectionsAnimation());
  } else {
    startSectionsAnimation();
  }
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function shuffleText(text: string): string {
  const array: string[] = text.split('');
  for (let i = array.length - 1; i > 0; i--) {
    const j: number = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array.join('');
}

function shuffleDirectText(element: HTMLElement, duration: number, shuffleInterval: number = 200): void {
  const textNodes: Text[] = [];
  for (const node of element.childNodes) {
    if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
      textNodes.push(node as Text);
    }
  }

  if (textNodes.length === 0) return;

  const originalTexts: string[] = textNodes.map(node => node.textContent || '');

  const applyShuffle = () => {
    textNodes.forEach((node, index) => {
      node.textContent = shuffleText(originalTexts[index]);
    });
  };

  const intervalId = setInterval(applyShuffle, shuffleInterval);

  setTimeout(() => {
    clearInterval(intervalId);
    textNodes.forEach((node, index) => {
      node.textContent = originalTexts[index];
    });
  }, duration);
}

function applyShuffleToMainAndChildren(mainElement: HTMLElement, duration: number): void {
  shuffleDirectText(mainElement, duration);

  const children: HTMLCollection = mainElement.children;
  for (let i = 0; i < children.length; i++) {
    const child = children[i] as HTMLElement;
    shuffleDirectText(child, duration);
    applyShuffleToMainAndChildren(child, duration);
  }
}

function startShuffleEffect(duration: number = 10000): void {
  const mainElement: HTMLElement | null = document.querySelector('main.shuffle-target');
  if (mainElement) {
    applyShuffleToMainAndChildren(mainElement, duration);
  }
}

interface MathModalElements {
  overlay: HTMLElement;
  container: HTMLElement;
  equation: HTMLElement;
  input: HTMLInputElement;
  submitBtn: HTMLButtonElement;
  feedback: HTMLElement;
}

class MathChallengeModal {
  private elements: MathModalElements;
  private currentResult: number = 0;
  private readonly tolerance: number = 0.01;

  constructor() {
    this.elements = {
      overlay: document.getElementById('mathModalOverlay') as HTMLElement,
      container: document.getElementById('mathModalContainer') as HTMLElement,
      equation: document.getElementById('mathEquation') as HTMLElement,
      input: document.getElementById('mathAnswer') as HTMLInputElement,
      submitBtn: document.getElementById('mathSubmit') as HTMLButtonElement,
      feedback: document.getElementById('mathFeedback') as HTMLElement
    };

    this.generateNewEquation();
    this.initEventListeners();
    this.showModal();
  }

  private generateNewEquation(): void {
    const a = Math.floor(Math.random() * 20) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    const c = Math.floor(Math.random() * 10) + 1;
    const d = Math.floor(Math.random() * 8) + 2;

    this.currentResult = Math.round((a + b * c / d) * 100) / 100;

    const equation = `${a} + ${b} × ${c} ÷ ${d} = ?`;
    this.elements.equation.textContent = equation;
  }

  private initEventListeners(): void {
    this.elements.submitBtn.addEventListener('click', () => this.checkAnswer());
    this.elements.input.addEventListener('keypress', (e: KeyboardEvent) => {
      if (e.key === 'Enter') this.checkAnswer();
    });
  }

  private checkAnswer(): void {
    const userAnswer = parseFloat(this.elements.input.value.replace(',', '.'));
    
    if (Math.abs(userAnswer - this.currentResult) <= this.tolerance) {
      this.onCorrectAnswer();
    } else {
      this.onWrongAnswer();
    }
  }

  private onCorrectAnswer(): void {
    alert('Parfait ! Calcul correct ! ✅');
    this.hideModal();
    this.unblockPageInteraction();
    
    new ProgressChallengeModal();
  }

  private onWrongAnswer(): void {
    this.elements.feedback.textContent = '❌ Faux ! Essayez encore.';
    this.elements.feedback.classList.add('error');
    this.elements.input.value = '';
    this.elements.input.focus();
    
    setTimeout(() => {
      this.elements.feedback.textContent = '';
      this.elements.feedback.classList.remove('error');
      this.generateNewEquation();
    }, 1500);
  }

  private showModal(): void {
    this.elements.overlay.classList.remove('hidden');
    this.elements.input.focus();
  }

  private hideModal(): void {
    this.elements.overlay.classList.add('hidden');
  }

  private blockPageInteraction(): void {
    document.body.style.overflow = 'hidden';
    const main = document.querySelector('main') as HTMLElement;
    if (main) main.style.pointerEvents = 'none';
  }

  private unblockPageInteraction(): void {
    document.body.style.overflow = '';
    const main = document.querySelector('main') as HTMLElement;
    if (main) main.style.pointerEvents = '';
  }
}

interface ProgressElements {
  overlay: HTMLElement;
  container: HTMLElement;
  progressBar: HTMLElement;
  progressFill: HTMLElement;
  progressText: HTMLElement;
  thresholdLine: HTMLElement;
  clickButton: HTMLButtonElement;
  status: HTMLElement;
}

class ProgressChallengeModal {
  private elements: ProgressElements;
  private progress: number = 0;
  private readonly threshold: number = 65;
  private drainInterval: number = 0;
  private clickCooldown: number = 0;

  constructor() {
    this.elements = {
      overlay: document.getElementById('progressModalOverlay') as HTMLElement,
      container: document.getElementById('progressModalContainer') as HTMLElement,
      progressBar: document.getElementById('progressBar') as HTMLElement,
      progressFill: document.getElementById('progressFill') as HTMLElement,
      progressText: document.getElementById('progressText') as HTMLElement,
      thresholdLine: document.getElementById('thresholdLine') as HTMLElement,
      clickButton: document.getElementById('progressButton') as HTMLButtonElement,
      status: document.getElementById('progressStatus') as HTMLElement
    };

    this.initGame();
    this.showModal();
  }

  private initGame(): void {
    this.progress = 0;
    this.updateDisplay();
    this.startDrain();
    this.initEventListeners();
  }

  private initEventListeners(): void {
    this.elements.clickButton.addEventListener('click', () => this.handleClick());
  }

  private handleClick(): void {
    if (this.clickCooldown > 0) return;
    
    this.clickCooldown = 100;
    setTimeout(() => this.clickCooldown = 0, this.clickCooldown);

    const boost = Math.max(1, 5 * (1 - this.progress / 100));
    this.progress = Math.min(100, this.progress + boost);
    
    this.updateDisplay();
    
    if (this.progress >= this.threshold) {
      this.onSuccess();
    }
  }

  private startDrain(): void {
    this.drainInterval = setInterval(() => {
      if (this.progress > 0) {
        this.progress = Math.max(0, this.progress - 0.5);
        this.updateDisplay();
      }
    }, 50);
  }

  private updateDisplay(): void {
    const fillHeight = (this.progress / 100) * 100;
    this.elements.progressFill.style.height = `${fillHeight}%`;
    
    this.elements.progressText.textContent = `${Math.round(this.progress)}%`;
    
    const dangerZone = Math.max(0, (this.progress - this.threshold + 10) / 20);
    const redIntensity = Math.min(1, dangerZone);
    this.elements.progressFill.style.background = 
      `linear-gradient(to top, 
        rgb(${Math.round(255 * redIntensity)}, ${Math.round(255 * (1 - redIntensity))}, 0), 
        #4CAF50)`;

    if (this.progress >= this.threshold) {
      this.elements.status.textContent = '🎉 Objectif atteint !';
      this.elements.status.classList.add('success');
    } else {
      this.elements.status.textContent = `Objectif: ${this.threshold}% - SPAM !`;
      this.elements.status.classList.remove('success');
    }
  }

  private onSuccess(): void {
    if (this.drainInterval) clearInterval(this.drainInterval);
    alert('🎉 Seuil atteint ! Vous avez gagné !');
    this.hideModal();
    this.unblockPageInteraction();
    
    new WritingChallengeModal();
  }

  private showModal(): void {
    this.elements.overlay.classList.remove('hidden');
  }

  private hideModal(): void {
    this.elements.overlay.classList.add('hidden');
    if (this.drainInterval) clearInterval(this.drainInterval);
  }

  private blockPageInteraction(): void {
    document.body.style.overflow = 'hidden';
    const main = document.querySelector('main') as HTMLElement;
    if (main) main.style.pointerEvents = 'none';
  }

  private unblockPageInteraction(): void {
    document.body.style.overflow = '';
    const main = document.querySelector('main') as HTMLElement;
    if (main) main.style.pointerEvents = '';
  }
}

interface WritingElements {
  overlay: HTMLElement;
  container: HTMLElement;
  textarea: HTMLTextAreaElement;
  counter: HTMLElement;
  commentContainer: HTMLElement;
}

const WRITING_COMMENTS = [
  "Qu'est-ce que vous écrivez bien!",
  "vous êtes une source d'inspiration pour moi",
  "encore un petit effort!",
  "vous y êtes presque",
  "je suis ému par ce que vous écrivez",
  "vous devez vous reconvertir en écrivain",
  "continuez sur cette voie",
  "pourrais-je vous demander un autographe?"
];

class WritingChallengeModal {
  private elements: WritingElements;
  private letterCount: number = 0;
  private readonly targetLetters: number = 300;
  private lastKeyTime: number = 0;
  private commentInterval: number = 0;
  private inactivityTimer: number = 0;
  private isActive: boolean = true;

  constructor() {
    this.elements = {
      overlay: document.getElementById('writingModalOverlay') as HTMLElement,
      container: document.getElementById('writingModalContainer') as HTMLElement,
      textarea: document.getElementById('writingTextarea') as HTMLTextAreaElement,
      counter: document.getElementById('writingCounter') as HTMLElement,
      commentContainer: document.getElementById('writingComment') as HTMLElement
    };

    this.initGame();
    this.showModal();
  }

  private initGame(): void {
    this.letterCount = 0;
    this.lastKeyTime = Date.now();
    this.isActive = true;
    this.elements.textarea.value = '';
    this.updateCounter();
    this.startInactivityCheck();
    this.initEventListeners();
  }

  private initEventListeners(): void {
    this.elements.textarea.addEventListener('input', (e: Event) => {
      this.onInput(e);
    });
  }

  private onInput(e: Event): void {
    this.lastKeyTime = Date.now();
    this.isActive = true;
    
    const textarea = e.target as HTMLTextAreaElement;
    const text = textarea.value;
    this.letterCount = text.replace(/\s/g, '').length;
    
    this.updateCounter();
    
    if (this.letterCount >= this.targetLetters) {
      this.onSuccess();
    }
    
    if (!this.commentInterval) {
      this.startComments();
    }
  }

  private startComments(): void {
    this.commentInterval = setInterval(() => {
      if (this.isActive) {
        const randomComment = WRITING_COMMENTS[Math.floor(Math.random() * WRITING_COMMENTS.length)];
        this.elements.commentContainer.textContent = randomComment;
        this.elements.commentContainer.classList.add('show');
        
        setTimeout(() => {
          this.elements.commentContainer.classList.remove('show');
        }, 4000);
      }
    }, 2000);
  }

  private startInactivityCheck(): void {
    this.inactivityTimer = setInterval(() => {
      if (Date.now() - this.lastKeyTime > 4000) {
        this.isActive = false;
      } else {
        this.isActive = true;
      }
    }, 1000);
  }

  private updateCounter(): void {
    const progress = Math.round((this.letterCount / this.targetLetters) * 100);
    this.elements.counter.textContent = `${this.letterCount}/${this.targetLetters} (${progress}%)`;
    
    if (this.letterCount >= this.targetLetters) {
      this.elements.counter.style.color = '#4CAF50';
    }
  }

  private onSuccess(): void {
    if (this.commentInterval) clearInterval(this.commentInterval);
    if (this.inactivityTimer) clearInterval(this.inactivityTimer);
    alert('🎉 300 lettres écrites ! Bravo !');
    this.hideModal();
    this.unblockPageInteraction();
    
    new AlphabetChallengeModal();
  }

  private showModal(): void {
    this.elements.overlay.classList.remove('hidden');
    this.elements.textarea.focus();
  }

  private hideModal(): void {
    this.elements.overlay.classList.add('hidden');
    if (this.commentInterval) clearInterval(this.commentInterval);
    if (this.inactivityTimer) clearInterval(this.inactivityTimer);
  }

  private blockPageInteraction(): void {
    document.body.style.overflow = 'hidden';
    const main = document.querySelector('main') as HTMLElement;
    if (main) main.style.pointerEvents = 'none';
  }

  private unblockPageInteraction(): void {
    document.body.style.overflow = '';
    const main = document.querySelector('main') as HTMLElement;
    if (main) main.style.pointerEvents = '';
  }
}

interface AlphabetElements {
  overlay: HTMLElement;
  container: HTMLElement;
  alphabetDisplay: HTMLElement;
  answerInput: HTMLInputElement;
  submitBtn: HTMLButtonElement;
  feedback: HTMLElement;
}

class AlphabetChallengeModal {
  private elements: AlphabetElements;
  private readonly alphabet: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  private missingLetter: string = '';

  constructor() {
    this.elements = {
      overlay: document.getElementById('alphabetModalOverlay') as HTMLElement,
      container: document.getElementById('alphabetModalContainer') as HTMLElement,
      alphabetDisplay: document.getElementById('alphabetDisplay') as HTMLElement,
      answerInput: document.getElementById('alphabetAnswer') as HTMLInputElement,
      submitBtn: document.getElementById('alphabetSubmit') as HTMLButtonElement,
      feedback: document.getElementById('alphabetFeedback') as HTMLElement
    };

    this.initGame();
    this.showModal();
  }

  private initGame(): void {
    this.generateAlphabet();
    this.initEventListeners();
    this.elements.answerInput.value = '';
    this.elements.answerInput.focus();
  }

  private generateAlphabet(): void {
    const randomIndex = Math.floor(Math.random() * this.alphabet.length);
    this.missingLetter = this.alphabet[randomIndex];

    const displayAlphabet = this.alphabet.split('').map((letter, index) => {
      return index === randomIndex ? '_' : letter;
    }).join(' ');

    this.elements.alphabetDisplay.textContent = displayAlphabet;
  }

  private initEventListeners(): void {
    this.elements.submitBtn.addEventListener('click', () => this.checkAnswer());
    this.elements.answerInput.addEventListener('keypress', (e: KeyboardEvent) => {
      if (e.key === 'Enter') this.checkAnswer();
    });
  }

  private checkAnswer(): void {
    const userAnswer = this.elements.answerInput.value.trim().toUpperCase();
    
    if (userAnswer === this.missingLetter) {
      this.onCorrectAnswer();
    } else {
      this.onWrongAnswer();
    }
  }

  private onCorrectAnswer(): void {
    alert('🎉 Bravo ! Lettre trouvée !');
    this.hideModal();
    this.unblockPageInteraction();
    
    // LANCER LA POPUP DE CONNEXION DES COULEURS
    new ColorMatchModal();
  }

  private onWrongAnswer(): void {
    this.elements.feedback.textContent = `❌ Non ! C'était ${this.missingLetter}. Nouvelle tentative...`;
    this.elements.feedback.classList.add('error');
    
    setTimeout(() => {
      this.elements.feedback.textContent = '';
      this.elements.feedback.classList.remove('error');
      this.initGame();
    }, 2000);
  }

  private showModal(): void {
    this.elements.overlay.classList.remove('hidden');
    this.elements.answerInput.focus();
  }

  private hideModal(): void {
    this.elements.overlay.classList.add('hidden');
  }

  private blockPageInteraction(): void {
    document.body.style.overflow = 'hidden';
    const main = document.querySelector('main') as HTMLElement;
    if (main) main.style.pointerEvents = 'none';
  }

  private unblockPageInteraction(): void {
    document.body.style.overflow = '';
    const main = document.querySelector('main') as HTMLElement;
    if (main) main.style.pointerEvents = '';
  }
}

// NOUVELLE POPUP CONNEXION DES COULEURS
interface ColorMatchElements {
  overlay: HTMLElement;
  container: HTMLElement;
  gameArea: HTMLElement;
  leftColumn: HTMLElement;
  rightColumn: HTMLElement;
  svgCanvas: SVGSVGElement;
  feedback: HTMLElement;
}

interface CircleData {
  color: string;
  element: HTMLElement;
  side: 'left' | 'right';
}

class ColorMatchModal {
  private elements: ColorMatchElements;
  private readonly colors: string[] = ['#8B5CF6', '#3B82F6', '#EAB308', '#EF4444']; // violet, bleu, jaune, rouge
  private readonly colorNames: string[] = ['violet', 'blue', 'yellow', 'red'];
  private leftCircles: CircleData[] = [];
  private rightCircles: CircleData[] = [];
  private selectedCircle: CircleData | null = null;
  private connections: Map<string, SVGLineElement> = new Map();
  private tempLine: SVGLineElement | null = null;
  private boundMouseMove: (e: MouseEvent) => void;

  constructor() {
    this.elements = {
      overlay: document.getElementById('colorMatchOverlay') as HTMLElement,
      container: document.getElementById('colorMatchContainer') as HTMLElement,
      gameArea: document.getElementById('colorMatchGameArea') as HTMLElement,
      leftColumn: document.getElementById('colorMatchLeft') as HTMLElement,
      rightColumn: document.getElementById('colorMatchRight') as HTMLElement,
      svgCanvas: document.querySelector<SVGSVGElement>('#colorMatchSvg')!,
      feedback: document.getElementById('colorMatchFeedback') as HTMLElement
    };

    this.boundMouseMove = this.onMouseMove.bind(this);
    this.initGame();
    this.showModal();
  }

  private initGame(): void {
    this.selectedCircle = null;
    this.connections.clear();
    this.leftCircles = [];
    this.rightCircles = [];
    
    // Nettoyer
    this.elements.leftColumn.innerHTML = '';
    this.elements.rightColumn.innerHTML = '';
    this.elements.svgCanvas.innerHTML = '';
    this.elements.feedback.textContent = '';
    this.elements.feedback.classList.remove('error');
    
    // Créer les colonnes mélangées
    const leftOrder = shuffleArray([...this.colors]);
    const rightOrder = shuffleArray([...this.colors]);
    
    leftOrder.forEach((color, index) => {
      const circle = this.createCircle(color, 'left', index);
      this.elements.leftColumn.appendChild(circle);
    });
    
    rightOrder.forEach((color, index) => {
      const circle = this.createCircle(color, 'right', index);
      this.elements.rightColumn.appendChild(circle);
    });
  }

  private createCircle(color: string, side: 'left' | 'right', index: number): HTMLElement {
    const circle = document.createElement('div');
    circle.className = 'color-circle';
    circle.style.backgroundColor = color;
    circle.dataset.color = color;
    circle.dataset.side = side;
    
    const circleData: CircleData = { color, element: circle, side };
    
    if (side === 'left') {
      this.leftCircles.push(circleData);
    } else {
      this.rightCircles.push(circleData);
    }
    
    circle.addEventListener('click', () => this.onCircleClick(circleData));
    
    return circle;
  }

  private onCircleClick(circleData: CircleData): void {
    // Si aucun cercle sélectionné, sélectionner celui-ci
    if (!this.selectedCircle) {
      this.selectedCircle = circleData;
      circleData.element.classList.add('selected');
      
      // Créer la ligne temporaire
      this.createTempLine(circleData);
      document.addEventListener('mousemove', this.boundMouseMove);
      return;
    }
    
    // Si on clique sur le même cercle, désélectionner
    if (this.selectedCircle === circleData) {
      this.cancelSelection();
      return;
    }
    
    // Si on clique sur un cercle du même côté, changer la sélection
    if (this.selectedCircle.side === circleData.side) {
      this.selectedCircle.element.classList.remove('selected');
      this.selectedCircle = circleData;
      circleData.element.classList.add('selected');
      this.updateTempLineStart(circleData);
      return;
    }
    
    // Vérifier si les couleurs correspondent
    if (this.selectedCircle.color === circleData.color) {
      // Bonne connexion !
      this.createConnection(this.selectedCircle, circleData);
      this.selectedCircle.element.classList.remove('selected');
      this.selectedCircle.element.classList.add('connected');
      circleData.element.classList.add('connected');
      this.cancelSelection();
      
      // Vérifier si toutes les connexions sont faites
      if (this.connections.size === 4) {
        this.onSuccess();
      }
    } else {
      // Mauvaise connexion - tout réinitialiser
      this.onWrongConnection();
    }
  }

  private createTempLine(circleData: CircleData): void {
    const rect = circleData.element.getBoundingClientRect();
    const gameRect = this.elements.gameArea.getBoundingClientRect();
    
    const startX = rect.left + rect.width / 2 - gameRect.left;
    const startY = rect.top + rect.height / 2 - gameRect.top;
    
    this.tempLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    this.tempLine.setAttribute('x1', startX.toString());
    this.tempLine.setAttribute('y1', startY.toString());
    this.tempLine.setAttribute('x2', startX.toString());
    this.tempLine.setAttribute('y2', startY.toString());
    this.tempLine.setAttribute('stroke', circleData.color);
    this.tempLine.setAttribute('stroke-width', '4');
    this.tempLine.setAttribute('stroke-linecap', 'round');
    this.tempLine.classList.add('temp-line');
    
    this.elements.svgCanvas.appendChild(this.tempLine);
  }

  private updateTempLineStart(circleData: CircleData): void {
    if (!this.tempLine) return;
    
    const rect = circleData.element.getBoundingClientRect();
    const gameRect = this.elements.gameArea.getBoundingClientRect();
    
    const startX = rect.left + rect.width / 2 - gameRect.left;
    const startY = rect.top + rect.height / 2 - gameRect.top;
    
    this.tempLine.setAttribute('x1', startX.toString());
    this.tempLine.setAttribute('y1', startY.toString());
    this.tempLine.setAttribute('stroke', circleData.color);
  }

  private onMouseMove(e: MouseEvent): void {
    if (!this.tempLine) return;
    
    const gameRect = this.elements.gameArea.getBoundingClientRect();
    const x = e.clientX - gameRect.left;
    const y = e.clientY - gameRect.top;
    
    this.tempLine.setAttribute('x2', x.toString());
    this.tempLine.setAttribute('y2', y.toString());
  }

  private cancelSelection(): void {
    if (this.selectedCircle) {
      this.selectedCircle.element.classList.remove('selected');
      this.selectedCircle = null;
    }
    
    if (this.tempLine) {
      this.tempLine.remove();
      this.tempLine = null;
    }
    
    document.removeEventListener('mousemove', this.boundMouseMove);
  }

  private createConnection(circle1: CircleData, circle2: CircleData): void {
    const rect1 = circle1.element.getBoundingClientRect();
    const rect2 = circle2.element.getBoundingClientRect();
    const gameRect = this.elements.gameArea.getBoundingClientRect();
    
    const x1 = rect1.left + rect1.width / 2 - gameRect.left;
    const y1 = rect1.top + rect1.height / 2 - gameRect.top;
    const x2 = rect2.left + rect2.width / 2 - gameRect.left;
    const y2 = rect2.top + rect2.height / 2 - gameRect.top;
    
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1.toString());
    line.setAttribute('y1', y1.toString());
    line.setAttribute('x2', x2.toString());
    line.setAttribute('y2', y2.toString());
    line.setAttribute('stroke', circle1.color);
    line.setAttribute('stroke-width', '4');
    line.setAttribute('stroke-linecap', 'round');
    line.classList.add('connection-line');
    
    this.elements.svgCanvas.appendChild(line);
    this.connections.set(circle1.color, line);
  }

  private onWrongConnection(): void {
    this.elements.feedback.textContent = '❌ Mauvaise couleur ! Tout est réinitialisé...';
    this.elements.feedback.classList.add('error');
    
    this.cancelSelection();
    
    setTimeout(() => {
      this.initGame();
    }, 1500);
  }

  private onSuccess(): void {
    alert('🎉 Bravo ! Toutes les couleurs sont reliées !');
    this.hideModal();
    this.unblockPageInteraction();
    
    // DÉCLENCHER LES ANIMATIONS FINALES
    initSectionsAnimationWhenReady();
    startShuffleEffect(10000);
  }

  private showModal(): void {
    this.elements.overlay.classList.remove('hidden');
  }

  private hideModal(): void {
    this.elements.overlay.classList.add('hidden');
    this.cancelSelection();
  }

  private blockPageInteraction(): void {
    document.body.style.overflow = 'hidden';
    const main = document.querySelector('main') as HTMLElement;
    if (main) main.style.pointerEvents = 'none';
  }

  private unblockPageInteraction(): void {
    document.body.style.overflow = '';
    const main = document.querySelector('main') as HTMLElement;
    if (main) main.style.pointerEvents = '';
  }
}

interface ModalButton extends HTMLButtonElement {
  dataset: {
    buttonId?: string;
  };
}

class ModalGame {
  private overlay: HTMLElement;
  private buttonsGrid: HTMLElement;
  private correctButtonIndex: number = 0;
  private totalButtons: number = 5;

  constructor() {
    this.overlay = document.getElementById('modalOverlay') as HTMLElement;
    this.buttonsGrid = document.getElementById('buttonsGrid') as HTMLElement;

    this.resetCorrectButton();
    this.init();
  }

  private init(): void {
    this.renderButtons();
    this.blockPageInteraction();
    this.showModal();
  }

  private resetCorrectButton(): void {
    this.correctButtonIndex = Math.floor(Math.random() * this.totalButtons);
  }

  private renderButtons(): void {
    this.buttonsGrid.replaceChildren();

    for (let i = 0; i < this.totalButtons; i++) {
      const button = document.createElement('button') as ModalButton;
      button.className = 'modal-btn';
      button.textContent = `${i + 1}`;
      button.dataset.buttonId = i.toString();

      button.addEventListener('click', (e: MouseEvent) =>
        this.handleButtonClick(e, i)
      );

      this.buttonsGrid.appendChild(button);
    }
  }

  private handleButtonClick(event: MouseEvent, buttonIndex: number): void {
    const button = event.currentTarget as ModalButton;

    if (buttonIndex === this.correctButtonIndex) {
      this.onCorrectButton();
    } else {
      this.onWrongButton(button);
    }
  }

  private onCorrectButton(): void {
    alert('Bravo ! Vous avez trouvé le bon bouton ! 🎉');
    this.hideModal();
    this.unblockPageInteraction();
    
    new MathChallengeModal();
  }

  private onWrongButton(button: ModalButton): void {
    button.classList.add('wrong');
    setTimeout(() => button.classList.remove('wrong'), 300);

    this.totalButtons += 2;
    this.resetCorrectButton();
    this.renderButtons();
  }

  private showModal(): void {
    this.overlay.classList.remove('hidden');
  }

  private hideModal(): void {
    this.overlay.classList.add('hidden');
  }

  private blockPageInteraction(): void {
    document.body.style.overflow = 'hidden';
    const main = document.querySelector('main') as HTMLElement;
    if (main) {
      main.style.pointerEvents = 'none';
    }
  }

  private unblockPageInteraction(): void {
    document.body.style.overflow = '';
    const main = document.querySelector('main') as HTMLElement;
    if (main) {
      main.style.pointerEvents = '';
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ModalGame();
});
