/**
 * Génère un identifiant visiteur aléatoire de 4 caractères (alphanumériques).
 * Format: lettres majuscules, minuscules et chiffres.
 * Utilisé comme clé primaire visiteur en base de données.
 *
 * @returns {string} ID aléatoire de 4 caractères (ex: 'A1bC')
 */
export const generateId = (): string => {
    const chars =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';
    for (let i = 0; i < 4; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
};
