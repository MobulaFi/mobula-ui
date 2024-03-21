export class ImageTool {
  constructor({ api }) {
    this.api = api;
  }

  static get toolbox() {
    return {
      icon: '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M3 4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4zm4 2v12h10V6H7zm7 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm-7 4a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0z"></path></svg>',
      title: "Insérer une image",
    };
  }

  render() {
    const container = document.createElement("div");
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.addEventListener("change", async (event) => {
      const file = event.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("image", file);
        const response = await fetch("URL_DE_VOTRE_API_D_UPLOAD", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        if (data && data.url) {
          this.api.blocks.insert("image", { url: data.url });
        }
      }
    });
    container.appendChild(input);
    return container;
  }

  save() {
    return {};
  }

  static get sanitize() {
    return {
      url: {},
    };
  }

  static get view() {
    return {
      name: "image",
      render({ file }) {
        const image = document.createElement("img");
        image.src = file.url;
        return image;
      },
    };
  }
}
