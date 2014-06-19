Filters = ->
  that = this
  @draw = (selector, btnSelector) ->
    i = 0
    #var $selector = $(selector);
    $(selector).html ""
    filters = ich.search({}, true)
    _.each @fields, (field, index) ->
      field.label = (if field.label isnt `undefined` then field.label else index)
      field.id = "field-" + i
      filters += ich.select(field, true)
      i++
    filters += ich.submitBtns({}, true)

    ich.accordion(sections: [
      id: "tabs"
      open: "in"
      title: "Tipos de asistencia médica"
      content: ich.tabs(
        tabs: @tabs
      , true)
    ,
      id: "advanced"
      collapsed: "collapsed"
      title: "Búsqueda avanzada"
      content: filters
    ]).appendTo selector

    # Update events for search field, buttons, selects
    $(selector + " #field-search").bind "change", @constructQuery
    $(selector + " .btn:not(#reset)").bind "click", @constructQuery
    $(selector + " select").selectpicker().bind "change", @constructQuery
    $(selector + " #reset").bind "click", ->
      $("body").addClass "loading"
      $(selector + " #field-search").val ""
      $(selector + " select").val("val", []).selectpicker("render")
      that.constructQuery()
      if window.responsive is "mobile" then $("body").toggleClass "right-sidebar-active"
      false

    # Click events for "tabs"
    $(selector + " #tabs a").bind "click", ->
      $("body").addClass "loading"
      $(selector + " #tabs a").removeClass "active"
      $(this).addClass "active"
      `activeTab = $(this).attr("rel")`
      $(btnSelector).toggleClass "active"
      that.constructQuery()
      if window.responsive is "mobile" then $("body").toggleClass "right-sidebar-active"
      false

    # Click event for "Show Filters" btn
    $(btnSelector).bind "click", ->
      $(this).toggleClass "active"
      $("body").toggleClass "right-sidebar-active"
    if window.responsive isnt "mobile"
      $("body").addClass "right-sidebar-active" 
      $(btnSelector).addClass "active"


  @constructQuery = ->
    i = 0
    values = {}
    # Add services (from tabs)
    if activeTab? and activeTab isnt "Todo tipo"
      values["Servicios ofrecidos"] = _.filter(@tabs, (tab) ->
        tab.title is activeTab
      )[0].services
    
    # Add search
    val = $("#field-search").val()
    values["search"] = val if val?

    # Add select fields
    _.each that.fields, (field, index) ->
      val = $("#field-" + i).val()
      values[index] = val if val?
      i++
    query.constructActive values

  @tabs = [
    title: "Todo tipo"
    color: "orange"
    icon: "icon-alltypes"
    services: []
  ,
    title: "Salud General"
    color: "green"
    icon: "icon-generalhealth"
    services: ["Administración de casos", "Atención primaria", "Salud de la mujer", "Salud del niño", "Atención para adolecentes", "Inmunizaciones", "Gestión de enfermedades crónicas", "Pruebas Tratamiento y Prevención de ITS", "Tratamiento y cuidados para SIDA/VIH", "Atención médica para veteranos", "Servicios de salud para personas LGBT"]
  ,
    title: "Salud mental/cognitivo-conductual"
    color: "purple"
    icon: "icon-alltypes"
    services: ["Tratamiento para el abuso de estupefacientes y alcohol", "Atención para la salud mental/conductal"]
  ,
    title: "Asistencia para el acceso"
    color: "red"
    icon: "icon-mentalbehavioural"
    services: ["Ayuda con inscripción en Medicaid", "Ayuda con inscripción en Connect for Health Colorado"]
  ,
    title: "Oral / Dental"
    color: "blue"
    icon: "icon-dentaloral"
    services: ["Atención Dental"]
  ,
    title: "Discapacidad y cuidado de ancianos"
    color: "darkblue"
    icon: "icon-disability"
    services: ["Atención médica para personas con discapacidades o necesidades especiales", "Servicios diurnos para adultos", "Servicios auxiliares de apoyo familiar"]
  ,
    title: "Otros tipos"
    color: "cadetblue"
    icon: "icon-other"
    services: ["Salud ocular", "Otro"]
  ]
  @fields =
    "Tipos de asistencia de último recurso":
      type: "select"
      msg: "Seleccionar"
      startCol: "Y"
      options: ["Centro de Salud Comunitario (CHC) / Centro de Salud Aprobado por el Gobierno Federal (FQHC) ","Clínica de Último Recurso Comunitaria","Departamento de Salud Pública o Enfermería Pública","Clínicas Médicas Rurales (RHC)","Centro de Salud Escolar (SBHC)","Agencia de Servicios Sociales","Asistencia con Solicitudes de Medicaid/CHP+","Asistencia con Connect for Health Colorado ","Clínica WIC","Clínica en Pediatría, HCP","Clínica de Planned Parenthood","Centro de Salud para los Veteranos","Clínica Comunitaria de Salud Mental","Clínica Dental Comunitaria","Clínica Oculista Comunitaria","Hospital de Acceso Crítico","Departamento de Urgencias","Programa de Atención para Indigentes de Colorado (CICP)","Junta de Enfoque Comunal (CCB)","Programa Residencial","Organización Voluntaria de Salud","Clínica para Migrantes","Clínica para Refugiados","Centro para la Vida Autónoma en el Hogar","Organización de Servicios para el SIDA (ASO)"," Otras clínicas comunitarias","Otra clínica dental","Otra Organización Comunitaria"]

    "Servicios ofrecidos":
      type: "select"
      msg: "Seleccionar"
      startCol: "BB"
      options: ["Atención primaria", "Atención Dental", "Salud ocular", "Salud mental/cognitivo-conductual", "Salud de la mujer", "Salud del niño", "Atención para adolecentes", "Servicios diurnos para adultos", "Servicios auxiliares de apoyo familiar", "Tratamiento para el abuso de estupefacientes y alcohol", "Administración de casos", "Gestión de enfermedades crónicas", "Tratamiento y cuidados para SIDA/VIH", "Pruebas Tratamiento y Prevención de ITS", "Atención médica para veteranos", "Atención médica para personas con discapacidades o necesidades especiales", "Servicios de salud para personas LGBT", "Inmunizaciones", "Ayuda con inscripción en Medicaid", "Ayuda con inscripción en Connect for Health Colorado", "Otro"]

    "Categorías de edades atendidas":
      type: "select"
      msg: "Seleccionar"
      startCol: "BW"
      options: ["Recién nacidos (0-3)", "Niños (3+)", "Adolescentes (13+)", "Adultos (18+)", "Personas de la tercera edad (65+)"]

    "Sectores de la población atendidos":
      label: "Poblaciónes atendidos"
      type: "select"
      msg: "Seleccionar"
      startCol: "CB"
      options: ["Trabajadores agrícolas migrantes", "Personas sin hogar", "LGBT", "Refugiados", "Indígenas norteamericanos", "Veteranos", "VIH/SIDA", "Discapacitados y personas con necesidades especiales", "Poblaciones rurales", "Otros"]

    "Idiomas hablados":
      type: "select"
      msg: "Seleccionar"
      startCol: "CL"
      options: ["Español", "Alemán", "Francés", "Vietnamita", "Coreano", "Chino", "Árabe", "Servicios de Interpretación Telefónica", "Otros"]

    "Subsidio económico y arreglos especiales":
      type: "select"
      msg: "Seleccionar"
      startCol: "CU"
      options: ["Escala móvil de tarifas para Atención primaria", "Descuento por pagar en efectivo/a la hora de entrega de servicios", "Programa de Atención para Indigentes de Colorado (CICP)", "Se acepta Medicaid/CHP+", "Otros servicios de descuentos", "Abierto tarde / Fines de semana"]

  @displayFields = [
    label: "Horas"
    col: "Hours"
    primary: true
  ,
    label: "Servicios"
    col: "Servicios ofrecidos"
    primary: true
  ,
    label: "Edades atendidas"
    col: "Categorías de edades atendidas"
  ,
    label: "Abierto a"
    col: "Area or Population Served"
  ,
    label: "Poblaciones atendidas"
    col: "Sectores de la población atendidos"
  ,
    label: "Idiomas"
    col: "Idiomas hablados"
  ,
    label: "Patrocinador"
    col: "Sponsor Name"
  ]


  return @