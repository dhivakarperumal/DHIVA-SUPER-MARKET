const { getPool } = require("../config/db");

const parseOfferInput = (body) => {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { error: "Offer data must be an object." };
  }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  const percentage = Number(body.offer_percentage);
  const description = typeof body.description === "string" ? body.description.trim() : "";
  const icon = typeof body.icon === "string" ? body.icon.trim() : "Tag";
  const status = body.status || "active";
  const showInHeader = body.show_in_header;

  if (!title || title.length > 160) {
    return { error: "Offer title is required and must be 160 characters or fewer." };
  }
  if (
    body.offer_percentage === "" ||
    body.offer_percentage === null ||
    !Number.isFinite(percentage) ||
    percentage < 0 ||
    percentage > 100
  ) {
    return { error: "Offer percentage must be between 0 and 100." };
  }
  if (description.length > 5000) {
    return { error: "Offer description must be 5000 characters or fewer." };
  }
  if (!/^[A-Za-z][A-Za-z0-9]{0,49}$/.test(icon)) {
    return { error: "Offer icon is invalid." };
  }
  if (status !== "active" && status !== "inactive") {
    return { error: "Offer status must be active or inactive." };
  }
  if (
    showInHeader !== undefined &&
    typeof showInHeader !== "boolean" &&
    showInHeader !== 0 &&
    showInHeader !== 1
  ) {
    return { error: "Header visibility must be a boolean value." };
  }

  return {
    value: {
      title,
      offer_percentage: percentage,
      description,
      icon,
      status,
      show_in_header: showInHeader === true || showInHeader === 1 ? 1 : 0,
    },
  };
};

const parseId = (value) => {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
};

const getOffers = async (req, res) => {
  try {
    const [offers] = await getPool().query("SELECT * FROM offers ORDER BY created_at DESC");
    res.status(200).json({ success: true, offers });
  } catch (error) {
    console.error("Error fetching offers:", error);
    res.status(500).json({ success: false, message: "Could not load offers." });
  }
};

const getHeaderOffers = async (req, res) => {
  try {
    const [offers] = await getPool().query(
      "SELECT id, title, offer_percentage, description, icon FROM offers WHERE status = 'active' AND show_in_header = 1 ORDER BY created_at DESC"
    );
    res.status(200).json({ success: true, offers });
  } catch (error) {
    console.error("Error fetching header offers:", error);
    res.status(500).json({ success: false, message: "Could not load header offers." });
  }
};

const getOfferById = async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) {
    return res.status(400).json({ success: false, message: "Offer ID is invalid." });
  }

  try {
    const [offers] = await getPool().query("SELECT * FROM offers WHERE id = ?", [id]);
    if (offers.length === 0) {
      return res.status(404).json({ success: false, message: "Offer not found." });
    }
    return res.status(200).json({ success: true, offer: offers[0] });
  } catch (error) {
    console.error("Error fetching offer:", error);
    return res.status(500).json({ success: false, message: "Could not load this offer." });
  }
};

const createOffer = async (req, res) => {
  const parsed = parseOfferInput(req.body);
  if (parsed.error) {
    return res.status(400).json({ success: false, message: parsed.error });
  }

  try {
    const { value } = parsed;
    const [result] = await getPool().query(
      `INSERT INTO offers (title, offer_percentage, description, icon, status, show_in_header)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [value.title, value.offer_percentage, value.description, value.icon, value.status, value.show_in_header]
    );
    const [offers] = await getPool().query("SELECT * FROM offers WHERE id = ?", [result.insertId]);
    return res.status(201).json({ success: true, offer: offers[0] });
  } catch (error) {
    console.error("Error creating offer:", error);
    return res.status(500).json({ success: false, message: "Could not create this offer." });
  }
};

const updateOffer = async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) {
    return res.status(400).json({ success: false, message: "Offer ID is invalid." });
  }
  const parsed = parseOfferInput(req.body);
  if (parsed.error) {
    return res.status(400).json({ success: false, message: parsed.error });
  }

  try {
    const pool = getPool();
    const [existing] = await pool.query("SELECT id FROM offers WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: "Offer not found." });
    }

    const { value } = parsed;
    await pool.query(
      `UPDATE offers
       SET title = ?, offer_percentage = ?, description = ?, icon = ?, status = ?, show_in_header = ?
       WHERE id = ?`,
      [value.title, value.offer_percentage, value.description, value.icon, value.status, value.show_in_header, id]
    );
    const [offers] = await pool.query("SELECT * FROM offers WHERE id = ?", [id]);
    return res.status(200).json({ success: true, offer: offers[0] });
  } catch (error) {
    console.error("Error updating offer:", error);
    return res.status(500).json({ success: false, message: "Could not update this offer." });
  }
};

const updateHeaderVisibility = async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) {
    return res.status(400).json({ success: false, message: "Offer ID is invalid." });
  }
  const showInHeader = req.body && req.body.show_in_header;
  if (
    typeof showInHeader !== "boolean" &&
    showInHeader !== 0 &&
    showInHeader !== 1
  ) {
    return res.status(400).json({ success: false, message: "Header visibility must be a boolean value." });
  }

  try {
    const pool = getPool();
    const [existing] = await pool.query("SELECT id FROM offers WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: "Offer not found." });
    }

    const visibility = showInHeader === true || showInHeader === 1 ? 1 : 0;
    await pool.query("UPDATE offers SET show_in_header = ? WHERE id = ?", [visibility, id]);
    const [offers] = await pool.query("SELECT * FROM offers WHERE id = ?", [id]);
    return res.status(200).json({ success: true, offer: offers[0] });
  } catch (error) {
    console.error("Error updating offer header visibility:", error);
    return res.status(500).json({ success: false, message: "Could not update header visibility." });
  }
};

const deleteOffer = async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) {
    return res.status(400).json({ success: false, message: "Offer ID is invalid." });
  }

  try {
    const [result] = await getPool().query("DELETE FROM offers WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Offer not found." });
    }
    return res.status(200).json({ success: true, message: "Offer deleted." });
  } catch (error) {
    console.error("Error deleting offer:", error);
    return res.status(500).json({ success: false, message: "Could not delete this offer." });
  }
};

module.exports = {
  getOffers,
  getHeaderOffers,
  getOfferById,
  createOffer,
  updateOffer,
  updateHeaderVisibility,
  deleteOffer,
};
