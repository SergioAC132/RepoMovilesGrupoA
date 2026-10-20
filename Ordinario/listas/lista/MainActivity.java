package com.example.listas;

import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;
import java.util.List;

public class MainActivity extends AppCompatActivity {

    private RecyclerView recyclerMaterias;
    private MateriaAdapter adapter;
    private List<Materia> listaMaterias;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // 1. Obtener el RecyclerView del XML
        recyclerMaterias = findViewById(R.id.recyclerMaterias);

        // 2. Definir los datos
        listaMaterias = new ArrayList<>();

        listaMaterias.add(new Materia(
                "Programación móvil",
                "Desarrollo de aplicaciones Android",
                1));

        listaMaterias.add(new Materia(
                "Bases de datos",
                "Diseño y administración de datos",
                2));

        listaMaterias.add(new Materia(
                "Desarrollo web",
                "Aplicaciones y servicios web",
                3));

        listaMaterias.add(new Materia(
                "Ingeniería de software",
                "Análisis y diseño de sistemas",
                4));

        listaMaterias.add(new Materia(
                "Redes",
                "Comunicación entre dispositivos",
                5));

        listaMaterias.add(new Materia(
                "Sistemas operativos",
                "Gestión de recursos del sistema",
                6));

        listaMaterias.add(new Materia(
                "Inteligencia artificial",
                "Algoritmos y aprendizaje automático",
                7));

        listaMaterias.add(new Materia(
                "Ciberseguridad",
                "Protección de sistemas y datos",
                8));

        listaMaterias.add(new Materia(
                "Programación avanzada",
                "Estructuras y patrones de diseño",
                9));

        listaMaterias.add(new Materia(
                "Arquitectura de software",
                "Organización de sistemas informáticos",
                10));

        // 3. Definir el posicionamiento vertical
        recyclerMaterias.setLayoutManager(
                new LinearLayoutManager(this));

        // 4. Crear y asignar el Adapter
        adapter = new MateriaAdapter(listaMaterias);
        recyclerMaterias.setAdapter(adapter);
    }
}
