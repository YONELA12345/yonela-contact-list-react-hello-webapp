const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			agendas: [],
			contacts: {},
			selectedAgenda: null,
			selectedContact: null,
		},
		actions: {
			// Cargar agendas desde la API
			loadAgendas: async () => {
				try {
					const response = await fetch("https://playground.4geeks.com/contact/agendas");
					const data = await response.json();
					setStore({ agendas: data });
				} catch (error) {
					console.error("Error loading agendas:", error);
				}
			},

			// Cargar contactos de una agenda específica
			loadContacts: async (slug) => {
				const store = getStore();
				if (store.contacts[slug]) return; // Si ya tenemos los contactos, no los volvemos a cargar

				try {
					const response = await fetch(`https://playground.4geeks.com/contact/agendas/${slug}/contacts`);
					if (!response.ok) throw new Error('Failed to fetch contacts');
					const data = await response.json();
					setStore({
						contacts: {
							...store.contacts,
							[slug]: data // Guardamos los contactos recibidos bajo el slug correspondiente
						}
					});
				} catch (error) {
					console.error("Error loading contacts:", error);
				}
			},

			// Agregar un nuevo contacto a una agenda específica usando el slug
			addContactToAgenda: async (slug, contactData) => {
				try {
					const response = await fetch(`https://playground.4geeks.com/contact/agendas/${slug}/contacts`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(contactData),
					});

					if (!response.ok) {
						throw new Error(`Failed to add contact: ${response.status} ${response.statusText}`);
					}

					const newContact = await response.json();
					const store = getStore();

					// Actualizamos localmente la lista de contactos
					setStore({
						contacts: {
							...store.contacts,
							[slug]: [...store.contacts[slug], newContact] // Añadir el nuevo contacto al estado
						}
					});

					console.log("New contact added to agenda:", newContact);
				} catch (error) {
					console.error("Error adding contact:", error);
					throw error;
				}
			},

			// Eliminar un contacto
			deleteContact: async (slug, contactId) => {
				try {
					const response = await fetch(`https://playground.4geeks.com/contact/agendas/${slug}/contacts/${contactId}`, {
						method: 'DELETE',
					});

					if (!response.ok) {
						throw new Error(`Failed to delete contact: ${response.status} ${response.statusText}`);
					}

					const store = getStore();

					// Filtramos el contacto eliminado localmente sin hacer otra petición a la API
					setStore({
						contacts: {
							...store.contacts,
							[slug]: store.contacts[slug].filter(contact => contact.id !== contactId) // Filtrar el contacto eliminado
						}
					});

					console.log(`Contacto ${contactId} eliminado correctamente.`);
				} catch (error) {
					console.error("Error deleting contact:", error);
				}
			},

			// Crear una nueva agenda
			createAgenda: async (agendaName) => {
				try {
					const slug = agendaName.replace(/ /g, '-');
					const response = await fetch(`https://playground.4geeks.com/contact/agendas/${slug}`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({ name: agendaName }),
					});

					if (!response.ok) {
						throw new Error(`Failed to create agenda: ${response.status} ${response.statusText}`);
					}

					const store = getStore();
					const updatedAgendas = Array.isArray(store.agendas)
						? [...store.agendas, await response.json()]
						: [await response.json()];

					setStore({ agendas: updatedAgendas });
				} catch (error) {
					console.error("Error creating agenda:", error);
					throw error;
				}
			},

			// Actualizar una agenda
			updateContact: async (slug, contactId, contactData) => {
				try {
					const response = await fetch(`https://playground.4geeks.com/contact/agendas/${slug}/contacts/${contactId}`, {
						method: 'PUT',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(contactData),
					});

					if (!response.ok) {
						throw new Error(`Failed to update contact: ${response.status} ${response.statusText}`);
					}

					const updatedContact = await response.json();
					const store = getStore();

					// Actualizar el contacto en el store
					setStore({
						contacts: {
							...store.contacts,
							[slug]: store.contacts[slug].map((contact) =>
								contact.id === contactId ? updatedContact : contact
							),
						},
					});

					console.log("Contacto actualizado correctamente:", updatedContact);
				} catch (error) {
					console.error("Error actualizando contacto:", error);
				}
			},

			// Eliminar una agenda
			deleteAgenda: async (agendaId) => {
				try {
					await fetch(`https://playground.4geeks.com/contact/agendas/${agendaId}`, {
						method: 'DELETE',
					});
					const store = getStore();
					setStore({
						agendas: store.agendas.filter(agenda => agenda.id !== agendaId)
					});
				} catch (error) {
					console.error("Error deleting agenda:", error);
				}
			}


		}
	};
};

export default getState;
