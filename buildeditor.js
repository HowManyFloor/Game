const equipmentByClass = {
    "Guerrier": {
        "helmet": [
            { name: "Casque en cuir", atk: 0, def: 5 },
            { name: "Casque en fer", atk: 0, def: 10 }
        ],
        "weapon": [
            { name: "Épée de base", atk: 15, def: 0 },
            { name: "Hache de guerre", atk: 20, def: 0 }
        ],
        "shoulders": [
            { name: "Épaulières légères", atk: 0, def: 3 },
            { name: "Épaulières lourdes", atk: 0, def: 8 }
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

    // Ajouter les statistiques de l'équipement aux valeurs de base
    atkTotal += equipmentStats.atk;
    defTotal += equipmentStats.def;
    vitTotal += equipmentStats.vit;

    // Mettre à jour l'affichage
    document.getElementById("atk").textContent = atkTotal;
    document.getElementById("def").textContent = defTotal;
    document.getElementById("vit").textContent = vitTotal;
    document.getElementById("level").textContent = playerLevel;
    document.getElementById("class").textContent = playerClass;
}

// Applique l'équipement à la statistique
function applyEquipment(item) {
    equipmentStats.atk += item.atk || 0;
    equipmentStats.def += item.def || 0;
    equipmentStats.vit += item.vit || 0;
    // Mettre à jour les stats de l'interface
    updateStats();
}

// Fonction pour afficher le bouton de réinitialisation
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

// Fonction pour ouvrir un panneau d'équipement
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

    // Si un item est déjà équipé, désactiver le panel d'équipement
    if (itemEquipped[slot]) {
        alert("Ce slot est déjà occupé !");
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

// Fonction pour appliquer la bordure en fonction de l'item sélectionné
function applyItemBorder(item) {
    const slotElement = document.getElementById(`${currentSlot}-slot`);

    // Applique la classe de rareté de l'item pour la bordure
    if (item && slotElement) {
        slotElement.classList.remove("gris", "vert", "bleu", "violet", "legendaire");
        slotElement.classList.add(item.rarity || 'gris'); // Définit la classe par défaut si aucune rareté n'est spécifiée
    }
}

// Fonction pour appliquer la sélection d'équipement
function applySelection() {
    const select = document.getElementById("equipment-select");
    const selectedItem = equipmentByClass[playerClass][currentSlot][select.value];

    // Vérifier si un item a été sélectionné
    if (selectedItem) {
        // Vérifier si le slot est déjà occupé
        if (itemEquipped[currentSlot]) {
            alert("Ce slot est déjà occupé. Vous devez d'abord réinitialiser l'équipement.");
            return;
        }

        // Appliquer les stats de l'équipement
        statsPoints.def += selectedItem.def || 0;
        statsPoints.atk += selectedItem.atk || 0;
        statsPoints.vit += selectedItem.vit || 0;

        // Mettre à jour les stats de l'interface
        updateStats();

        // Enregistrer l'item sélectionné
        itemEquipped[currentSlot] = selectedItem;

        // Appliquer la bordure persistante en fonction de l'item sélectionné
        applyItemBorder(selectedItem);

        // Fermer le panneau après application
        closePanels();
        document.getElementById(`reset-${currentSlot}`).style.display = "inline-block";
    }
}

// Fonction pour réinitialiser l'équipement
function resetEquipment(slot) {
    if (!itemEquipped[slot]) {
        return; // Si rien n'est équipé, on ne fait rien
    }

    const selectedItem = itemEquipped[slot];

    // Soustraire les stats de l'équipement
    if (selectedItem) {
        statsPoints.atk -= selectedItem.atk || 0;
        statsPoints.def -= selectedItem.def || 0;
        statsPoints.vit -= selectedItem.vit || 0;
    }

    // Mettre à jour les stats
    updateStats();

    // Supprimer l'item du slot
    itemEquipped[slot] = null;

    // Réinitialiser la bordure du slot à la bordure noire
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

// Fonction pour mettre à jour les choix de stats
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
    playerLevel = parseInt(document.getElementById("level-input").value); // Récupère le niveau
    playerClass = document.getElementById("class-select").value; // Récupère la classe
    availablePoints = 5 + (playerLevel - 1) * 2; // Calcule les points disponibles
    statsPoints = { atk: 0, def: 0, vit: 0 }; // Réinitialise les points de stats
    
    updateStats(); // Met à jour les stats affichées
    
    // Ferme le panneau de niveau/classe après application
    document.getElementById("class-level-panel").style.display = "none"; 
}

// Fonction pour appliquer la bordure en fonction de la rareté
function updateBorderColor() {
    const rarity = document.getElementById("rarity-select").value; // Récupère la rareté sélectionnée
    const slotElement = document.getElementById(`${currentSlot}-slot`); // Récupère l'élément du slot actuel

    // Si un item est sélectionné, applique la bordure de cet item
    if (itemEquipped[currentSlot]) {
        const item = itemEquipped[currentSlot];
        slotElement.classList.remove("gris", "vert", "bleu", "violet", "legendaire");
        slotElement.classList.add(item.rarity || 'gris'); // Applique la rareté de l'item
    } else {
        // Si aucun item n'est sélectionné, applique la rareté du sélecteur
        slotElement.classList.remove("gris", "vert", "bleu", "violet", "legendaire");
        slotElement.classList.add(rarity); // Applique la rareté choisie
    }
// Appel de la fonction de mise à jour de la bordure à chaque changement de rareté
document.getElementById("rarity-select").addEventListener("change", updateBorderColor);
}

// Appel de la fonction de mise à jour de la bordure à chaque changement de rareté
document.getElementById("rarity-select").addEventListener("change", updateBorderColor);

// Fonction pour valider la sélection
function validateSelection() {
    const rarity = document.getElementById("rarity-select").value;
    const slotElement = document.getElementById(`${currentSlot}-slot`);
    if (slotElement) {
        slotElement.classList.remove("gris", "vert", "bleu", "violet", "legendaire");
        slotElement.classList.add(rarity);
    }
    closePanels();
}
