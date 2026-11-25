package com.andina.trading.controller;

import com.andina.trading.repository.AccionRepository;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.web.bind.annotation.*;

@RestController
public class HistorialController {
    private final AccionRepository acciones;

    public HistorialController(AccionRepository acciones) {
        this.acciones = acciones;
    }

    record Punto(long time, BigDecimal value) {}

    @GetMapping("/mercado/historial")
    public List<Punto> historial(@RequestParam String simbolo) {
        return acciones.findTop300ByNombreEmpresaOrderByFechaActualizacionDescIdAccionDesc(simbolo)
                .reversed().stream()
                .map(a -> new Punto(a.getFechaActualizacion().toInstant().getEpochSecond(), a.getPrecioActual()))
                .toList();
    }
}
