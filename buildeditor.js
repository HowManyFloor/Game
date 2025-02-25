const equipmentByClass = {
    "Guerrier": {
        "helmet": [
            { name: "Casque en cuir", atk: 0, def: 5 },
            { name: "Casque en fer", atk: 0, def: 10 }
        ],
        "weapon": [
            { name: "�p�e de base", atk: 15, def: 0 },
            { name: "Hache de guerre", atk: 20, def: 0 }
        ],
        "shoulders": [
            { name: "�pauli�res l�g�res", atk: 0, def: 3 },
            { name: "�pauli�res lourdes", atk: 0, def: 8 }
        ]
    }
};

let currentSlot = "";
let selectedRarity = "";
let itemSelected = null;
let playerLevel = 1;
let availablePoints = 5;
let statsPoints = { atk: 0, def: 0, vit: 0 };
let playerClass = "Guerrier";
let itemEquipped = {};
let equipmentStats = { atk: 0, def: 0, vit: 0 };

const baseStats = {
    "Guerrier": { atk: 10, def: 15, vit: 25 },
    "Magicien": { atk: 15, def: 5, vit: 20 },
    "Voleur": { atk: 12, def: 10, vit: 30 },
    "Clerc": { atk: 12, def: 10, vit: 30 },
    "Necro": { atk: 12, def: 10, vit: 30 }
};

const rarityLimits = {
    "gris": { atk: [0, 5], def: [0, 2], vit: [0, 1] },
    "vert": { atk: [5, 10], def: [2, 5], vit: [1, 2] },
    "bleu": { atk: [10, 15], def: [5, 10], vit: [2, 4] },
    "violet": { atk: [15, 20], def: [10, 15], vit: [4, 6] },
    "legendaire": { atk: [20, 30], def: [15, 20], vit: [6, 8] }
};

function updateStats() {
    const levelMultiplier = 1 + (playerLevel - 1) * 0.1;
    const base = baseStats[playerClass];

    // Calcul des statistiques de base
    let atkTotal = base.atk + statsPoints.atk * 2;
    let defTotal = base.def + statsPoints.def * 2;
    let vitTotal = base.vit + statsPoints.vit * 2;

    // Appliquer les multiplicateurs de niveau seulement aux stats de base
    atkTotal *= levelMultiplier;
    defTotal *= levelMultiplier;
    vitTotal *= levelMultiplier;

    // Ajouter les statistiques de l'�quipement aux valeurs de base
    atkTotal += equipmentStats.atk;
    defTotal += equipmentStats.def;
    vitTotal += equipmentStats.vit;

    // Mettre � jour l'affichage
    document.getElementById("atk").textContent = atkTotal;
    document.getElementById("def").textContent = defTotal;
    document.getElementById("vit").textContent = vitTotal;
    document.getElementById("level").textContent = playerLevel;
    document.getElementById("class").textContent = playerClass;
}

// Applique l'�quipement � la statistique
function applyEquipment(item) {
    equipmentStats.atk += item.atk || 0;
    equipmentStats.def += item.def || 0;
    equipmentStats.vit += item.vit || 0;
    // Mettre � jour les stats de l'interface
    updateStats();
}

// Fonction pour afficher le bouton de r�initialisation
function showResetButton(slot) {
    const resetButton = document.getElementById(`reset-${slot}`);
    resetButton.style.display = "inline-block"; // Assurez-vous qu'il est visible
}

// Fonction pour ajouter des points de statistiques
function addStat(stat) {
    if (availablePoints > 0) {
        statsPoints[stat]++;
        availablePoints--;
        document.getElementById(stat + "-points").textContent = statsPoints[stat];
        document.getElementById("available-points").textContent = availablePoints;
        updateStats();
    }
}

// Fonction pour appliquer les statistiques
function applyStats() {
    document.getElementById("stats-panel").style.display = "none";
    updateStats();
}

// Fonction pour ouvrir un panneau d'�quipement
function openPanel(slot) {
    closePanels();
    if (currentSlot === slot) return;
    currentSlot = slot;

    updateBorderColor();

    const classEquipment = equipmentByClass[playerClass][slot];
    const panel = document.getElementById("equipment-panel");
    panel.style.display = "block";

    const select = document.getElementById("equipment-select");
    select.innerHTML = "";

    // Si un item est d�j� �quip�, d�sactiver le panel d'�quipement
    if (itemEquipped[slot]) {
        alert("Ce slot est d�j� occup� !");
        return;
    }

    classEquipment.forEach((item, index) => {
        let option = document.createElement("option");
        option.value = index;
        option.textContent = item.name;
        select.appendChild(option);
    });
}

// Fonction pour fermer les panneaux ouverts
function closePanels() {
    document.getElementById("equipment-panel").style.display = "none";
    document.getElementById("stats-panel").style.display = "none";
    document.getElementById("class-level-panel").style.display = "none";
}

// Fonction pour appliquer la bordure en fonction de l'item s�lectionn�
function applyItemBorder(item) {
    const slotElement = document.getElementById(`${currentSlot}-slot`);

    // Applique la classe de raret� de l'item pour la bordure
    if (item && slotElement) {
        slotElement.classList.remove("gris", "vert", "bleu", "violet", "legendaire");
        slotElement.classList.add(item.rarity || 'gris'); // D�finit la classe par d�faut si aucune raret� n'est sp�cifi�e
    }
}

// Fonction pour appliquer la s�lection d'�quipement
function applySelection() {
    const select = document.getElementById("equipment-select");
    const selectedItem = equipmentByClass[playerClass][currentSlot][select.value];

    // V�rifier si un item a �t� s�lectionn�
    if (selectedItem) {
        // V�rifier si le slot est d�j� occup�
        if (itemEquipped[currentSlot]) {
            alert("Ce slot est d�j� occup�. Vous devez d'abord r�initialiser l'�quipement.");
            return;
        }

        // Appliquer les stats de l'�quipement
        statsPoints.def += selectedItem.def || 0;
        statsPoints.atk += selectedItem.atk || 0;
        statsPoints.vit += selectedItem.vit || 0;

        // Mettre � jour les stats de l'interface
        updateStats();

        // Enregistrer l'item s�lectionn�
        itemEquipped[currentSlot] = selectedItem;

        // Appliquer la bordure persistante en fonction de l'item s�lectionn�
        applyItemBorder(selectedItem);

        // Fermer le panneau apr�s application
        closePanels();
        document.getElementById(`reset-${currentSlot}`).style.display = "inline-block";
    }
}

// Fonction pour r�initialiser l'�quipement
function resetEquipment(slot) {
    if (!itemEquipped[slot]) {
        return; // Si rien n'est �quip�, on ne fait rien
    }

    const selectedItem = itemEquipped[slot];

    // Soustraire les stats de l'�quipement
    if (selectedItem) {
        statsPoints.atk -= selectedItem.atk || 0;
        statsPoints.def -= selectedItem.def || 0;
        statsPoints.vit -= selectedItem.vit || 0;
    }

    // Mettre � jour les stats
    updateStats();

    // Supprimer l'item du slot
    itemEquipped[slot] = null;

    // R�initialiser la bordure du slot � la bordure noire
    const slotElement = document.getElementById(`${slot}-slot`);
    slotElement.style.border = "2px solid #000"; // Remettre la bordure noire
}

// Fonction pour ouvrir le panneau de stats
function openStatsPanel() {
    closePanels();
    document.getElementById("stats-panel").style.display = "block";
    updateStats();
    document.getElementById("available-points").textContent = availablePoints;
}

// Fonction pour mettre � jour les choix de stats
function updateStatChoices() {
    const rarity = document.getElementById("rarity-select").value;
    const additionalStats = document.getElementById("additional-stats");
    additionalStats.innerHTML = ""; // Vider les options existantes
    const stats = rarityLimits[rarity];

    // Afficher des champs de saisie pour chaque statistique
    Object.keys(stats).forEach(stat => {
        let statDiv = document.createElement("div");
        statDiv.innerHTML = `<label for="${stat}">${stat.toUpperCase()}</label>
                             <input type="number" id="${stat}-input" min="${stats[stat][0]}" max="${stats[stat][1]}" 
                             value="${stats[stat][0]}" />`;
        additionalStats.appendChild(statDiv);
    });
}

function openClassLevelPanel() {
    closePanels();  // Ferme tous les panneaux ouverts
    document.getElementById("class-level-panel").style.display = "block";  // Ouvre le panneau de classe/niveau
}

function applyClassLevel() {
    playerLevel = parseInt(document.getElementById("level-input").value); // R�cup�re le niveau
    playerClass = document.getElementById("class-select").value; // R�cup�re la classe
    availablePoints = 5 + (playerLevel - 1) * 2; // Calcule les points disponibles
    statsPoints = { atk: 0, def: 0, vit: 0 }; // R�initialise les points de stats
    
    updateStats(); // Met � jour les stats affich�es
    
    // Ferme le panneau de niveau/classe apr�s application
    document.getElementById("class-level-panel").style.display = "none"; 
}

// Fonction pour appliquer la bordure en fonction de la raret�
function updateBorderColor() {
    const rarity = document.getElementById("rarity-select").value; // R�cup�re la raret� s�lectionn�e
    const slotElement = document.getElementById(`${currentSlot}-slot`); // R�cup�re l'�l�ment du slot actuel

    // Si un item est s�lectionn�, applique la bordure de cet item
    if (itemEquipped[currentSlot]) {
        const item = itemEquipped[currentSlot];
        slotElement.classList.remove("gris", "vert", "bleu", "violet", "legendaire");
        slotElement.classList.add(item.rarity || 'gris'); // Applique la raret� de l'item
    } else {
        // Si aucun item n'est s�lectionn�, applique la raret� du s�lecteur
        slotElement.classList.remove("gris", "vert", "bleu", "violet", "legendaire");
        slotElement.classList.add(rarity); // Applique la raret� choisie
    }
// Appel de la fonction de mise � jour de la bordure � chaque changement de raret�
document.getElementById("rarity-select").addEventListener("change", updateBorderColor);
}

// Appel de la fonction de mise � jour de la bordure � chaque changement de raret�
document.getElementById("rarity-select").addEventListener("change", updateBorderColor);

// Fonction pour valider la s�lection
function validateSelection() {
    const rarity = document.getElementById("rarity-select").value;
    const slotElement = document.getElementById(`${currentSlot}-slot`);
    if (slotElement) {
        slotElement.classList.remove("gris", "vert", "bleu", "violet", "legendaire");
        slotElement.classList.add(rarity);
    }
    closePanels();
}
