
let commonProperties = {
  columns: {
    Familias: [
      {field: "id", header: "id"},
      {field: "codigo", header: "codigo"},
      {field: "descripcion", header: "descripcion"},
    ],
    Grupos: [
      {field: "id", header: "id"},
      {field: "description", header: "descripcion"},
      {field: "nombre", header: "nombre"},
      {field: "familia", header: "familia"},
    ],
    "Unidades de Medida": [
      {field: "codigo", header: "codigo"},
      {field: "descripcion", header: "descripcion"},
    ],
    "Factores de conversión": [
      {field: "id", header: "id"},
      {field: "description", header: "descripcion"},
      {field: "um", header: "um"},
      {field: "cantidad", header: "cantidad"},
      {field: "um_eq", header: "um_eq"},
    ],
    Productos: [
      {field: "code", header: "code"},
      {field: "autoservicio", header: "Aut.Serv."},

      {field: "description", header: "description"},
      {field: "precio_compra", header: "costo"},
      {field: "precio_lista", header: "precio"},
      {field: "cant_caja", header: "Caja"},
      {field: "content", header: "Cont."},
      {field: "uM", header: "um"},
      {field: "grupod", header: "grupo"},
      // {field: "tipo", header: "tipo"},
    ],
    Repartidores: [
      {field: "id", header: "id"},
      {field: "nombres", header: "nombres"},
      {field: "edad", header: "edad"},
      {field: "sexo", header: "sexo"},
      {field: "ruta", header: "ruta"},
    ],
    Rutas: [
      {field: "no_ruta", header: "ruta"},
      {field: "descripcion", header: "descripcion"},
    ],
  },
};
const controls = [
    {
      label: "Familias",
      icon: "pi pi-fw pi-tag",
        to: "/pages/crud/Familias",
      properties: commonProperties.columns.Familias,
      routeApi: 'familias'
    },
    {
      label: "Grupos",
      icon: "pi pi-fw pi-tags",
      to: "/pages/crud/Grupos",
      properties: commonProperties.columns.Grupos,
      routeApi: 'grupos'
    },
    {
      label: "Unidades de medida",
      icon: "pi pi-fw pi-pound",
      to: "/pages/crud/Unidades de medida",
      properties: commonProperties.columns["Unidades de Medida"],
      routeApi: 'um'
    },
    {
      label: "Factores de conversión",
      icon: "pi pi-fw pi-sliders-v",
      to: "/pages/crud/Factores de conversión",
      properties: commonProperties.columns["Factores de conversión"],
      routeApi: 'factores_conversion'
    },
    {
      label: "Productos",
      icon: "pi pi-fw pi-box",
      to: "/pages/crud/Productos",
      properties: commonProperties.columns.Productos,
      routeApi: 'productos'
    },
    {
      label: "Repartidores",
      icon: "pi pi-fw pi-truck",
      to: "/pages/crud/Repartidores",
      properties: commonProperties.columns.Repartidores,
      routeApi: 'repartidores'
    },
    {
      label: "Rutas",
      icon: "pi pi-fw pi-map",
      to: "/pages/crud/Rutas",
      properties: commonProperties.columns.Rutas,
      routeApi: 'rutas'
    },
  ];
  
  export let getCurrentColumns = (campo) => {
    console.log(controls)
    return controls.filter((control) => control.label === campo);
  };
  