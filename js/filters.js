var Filters;

Filters = function() {
  var that;
  that = this;
  this.draw = function(selector, btnSelector) {
    var filters, i;
    i = 0;
    $(selector).html("");
    filters = ich.search({}, true);
    _.each(this.fields, function(field, index) {
      field.label = (field.label !== undefined ? field.label : index);
      field.id = "field-" + i;
      filters += ich.select(field, true);
      return i++;
    });
    filters += ich.submitBtns({}, true);
    ich.accordion({
      sections: [
        {
          id: "tabs",
          open: "in",
          title: "Tipos de asistencia médica",
          content: ich.tabs({
            tabs: this.tabs
          }, true)
        }, {
          id: "advanced",
          collapsed: "collapsed",
          title: "Filtros para búsqueda avanzada",
          content: filters
        }
      ]
    }).appendTo(selector);
    $(selector + " #field-search").bind("change", this.constructQuery);
    $(selector + " .btn:not(#reset)").bind("click", this.constructQuery);
    $(selector + " select").selectpicker().bind("change", this.constructQuery);
    $(selector + " #reset").bind("click", function() {
      $("body").addClass("loading");
      $(selector + " #field-search").val("");
      $(selector + " select").val("val", []).selectpicker("render");
      that.constructQuery();
      if (window.responsive === "mobile") {
        $("body").toggleClass("right-sidebar-active");
      }
      return false;
    });
    $(selector + " #tabs a").bind("click", function() {
      $("body").addClass("loading");
      $(selector + " #tabs a").removeClass("active");
      $(this).addClass("active");
      activeTab = $(this).attr("rel");
      $(btnSelector).toggleClass("active");
      that.constructQuery();
      if (window.responsive === "mobile") {
        $("body").toggleClass("right-sidebar-active");
      }
      return false;
    });
    $(btnSelector).bind("click", function() {
      $(this).toggleClass("active");
      return $("body").toggleClass("right-sidebar-active");
    });
    if (window.responsive !== "mobile") {
      $("body").addClass("right-sidebar-active");
      return $(btnSelector).addClass("active");
    }
  };
  this.constructQuery = function() {
    var i, val, values;
    i = 0;
    values = {};
    if ((typeof activeTab !== "undefined" && activeTab !== null) && activeTab !== "Todo tipo") {
      values["Servicios ofrecidos"] = _.filter(this.tabs, function(tab) {
        return tab.title === activeTab;
      })[0].services;
    }
    val = $("#field-search").val();
    if (val != null) {
      values["search"] = val;
    }
    _.each(that.fields, function(field, index) {
      val = $("#field-" + i).val();
      if (val != null) {
        values[index] = val;
      }
      return i++;
    });
    return query.constructActive(values);
  };
  this.tabs = [
    {
      title: "Todo tipo",
      color: "orange",
      icon: "icon-alltypes",
      services: []
    }, {
      title: "Asistencia Médica General",
      color: "green",
      icon: "icon-generalhealth",
      services: ["Administración de casos", "Atención Primaria", "Salud de la mujer", "Salud del niño", "Atención para adolecentes", "Inmunizaciones", "Gestión de enfermedades crónicas", "Pruebas Tratamiento y Prevención de ITS", "Tratamiento y cuidados para SIDA/VIH", "Atención médica para veteranos de las fuerzas armadas", "Servicios de salud para personas LGBT"]
    }, {
      title: "Mental / Cognitivo-conductual",
      color: "purple",
      icon: "icon-alltypes",
      services: ["Tratamiento para el abuso de estupefacientes y alcohol", "Atención para la salud mental/conductal"]
    }, {
      title: "Asistencia para obtener acceso",
      color: "red",
      icon: "icon-mentalbehavioural",
      services: ["Ayuda con inscripción en Medicaid", "Ayuda con inscripción en Connect for Health Colorado"]
    }, {
      title: "Oral / Dental",
      color: "blue",
      icon: "icon-dentaloral",
      services: ["Atención Dental"]
    }, {
      title: "Discapacidad y cuidado de ancianos",
      color: "darkblue",
      icon: "icon-disability",
      services: ["Atención médica para personas con discapacidades o necesidades especiales", "Servicios diurnos para adultos", "Servicios auxiliares de apoyo familiar"]
    }, {
      title: "Otros tipos",
      color: "cadetblue",
      icon: "icon-other",
      services: ["Atención para los ojos", "Otro"]
    }
  ];
  this.fields = {
    "Tipos de asistencia de último recurso": {
      type: "select",
      msg: "Seleccionar",
      startCol: "Y",
      options: ["Centro de Salud Comunitario (CHC) / Centro de Salud Aprobado por el Gobierno Federal (FQHC) ", "Clínica de Último Recurso Financiada por la Comunidad (CSNC)", "Departamento de Salud Pública y Servicios de Enfermería Pública Locales", "Clínicas Médicas Rurales (RHC)", "Centro de Salud Escolar (SBHC)", "Agencia de Servicios Humanos/Sociales", "Local Certificado para Asistir con Solicitudes de Medicaid/CHP+", "Local de Asistencia para Connect for Health Colorado ", "Local de Clínica WIC", "Clínica Especializada en Pediatría del programa HCP", "Clínica de Planificación Familiar Planned Parenthood", "Centro de Salud de la Asociación de Veteranos", "Clínica Comunitaria de Salud Mental", "Clínica Dental Comunitaria", "Clínica Oculista Comunitaria", "Hospital de Acceso Crítico", "Departamento de Urgencias", "Proveedor del Programa de Atención para Indigentes de Colorado (CICP)", "Junta de Enfoque Comunal (CCB)", "Programa Residencial", "Organización Sanitaria de Voluntarios", "Centro de Salud para Trabajadores Migratorios", "Local de Servicios de Salud para Refugiados", "Centro para la Vida Autónoma en el Hogar", "Organización de Servicios para el SIDA (ASO)", "Otras clínicas comunitarias", "Otra clínica dental", "Otra organización basada en la comunidad"]
    },
    "Servicios ofrecidos": {
      type: "select",
      msg: "Seleccionar",
      startCol: "BB",
      options: ["Atención Primaria", "Atención Dental", "Atención para los ojos", "Atención para la salud mental/conductal", "Salud de la mujer", "Salud del niño", "Atención para adolecentes", "Servicios diurnos para adultos", "Servicios auxiliares de apoyo familiar", "Tratamiento para el abuso de estupefacientes y alcohol", "Administración de casos", "Gestión de enfermedades crónicas", "Tratamiento y cuidados para SIDA/VIH", "Pruebas Tratamiento y Prevención de ITS", "Atención médica para veteranos de las fuerzas armadas", "Atención médica para veteranos de las fuerzas armadas", "Servicios de salud para personas LGBT", "Inmunizaciones", "Ayuda con inscripción en Medicaid", "Ayuda con inscripción en Connect for Health Colorado", "Otro"]
    },
    "Categorías de edades atendidas": {
      type: "select",
      msg: "Seleccionar",
      startCol: "BW",
      options: ["Recién nacidos (0-3)", "Niños (3+)", "Adolescentes (13+)", "Adultos (18+)", "Personas de la tercera edad (65+)"]
    },
    "Sectores de la población atendidos": {
      label: "Populations Served",
      type: "select",
      msg: "Seleccionar",
      startCol: "CB",
      options: ["Trabajadores agrícolas migrantes", "Personas sin hogar", "LGBT", "Refugiados", "Indígenas norteamericanos", "Veteranos de las fuerzas armadas", "VIH/SIDA", "Discapacitados y personas con necesidades especiales", "Poblaciones rurales", "Otros"]
    },
    "Idiomas hablados": {
      type: "select",
      msg: "Seleccionar",
      startCol: "CL",
      options: ["Español", "Alemán", "Francés", "Vietnamita", "Coreano", "Chino", "Árabe", "Servicios de Interpretación Telefónica", "Otros"]
    },
    "Subsidio económico y arreglos especiales": {
      type: "select",
      msg: "Seleccionar",
      startCol: "CU",
      options: ["Escala móvil de tarifas para atención primaria", "Descuento por pagar en efectivo/a la hora de entrega de servicios", "Servicios del Programa de Atención para Indigentes de Colorado (CICP)", "Se acepta Medicaid/CHP+", "Otros servicios de descuentos", "Abierto tarde / fines de semana", "¿Otros?"]
    }
  };
  this.displayFields = [
    {
      label: "Horas",
      col: "Hours",
      primary: true
    }, {
      label: "Servicios",
      col: "Servicios ofrecidos",
      primary: true
    }, {
      label: "Edades atendidas",
      col: "Categorías de edades atendidas"
    }, {
      label: "Abierto a",
      col: "Area or Population Served"
    }, {
      label: "Población atendidos",
      col: "Sectores de la población atendidos"
    }, {
      label: "Idiomas",
      col: "Idiomas hablados"
    }, {
      label: "Patrocinador",
      col: "Sponsor Name"
    }
  ];
  return this;
};

/*
//@ sourceMappingURL=filters.js.map
*/