package com.example.listas;

public class Materia {

    private String nombre;
    private String descripcion;
    private int numero;

    public Materia(String nombre, String descripcion, int numero) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.numero = numero;
    }

    public String getNombre() {
        return nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public int getNumero() {
        return numero;
    }
}
