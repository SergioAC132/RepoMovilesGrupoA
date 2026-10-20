package com.example.listas;


import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.List;

public class MateriaAdapter
        extends RecyclerView.Adapter<MateriaAdapter.MateriaViewHolder> {

    private final List<Materia> listaMaterias;

    public MateriaAdapter(List<Materia> listaMaterias) {
        this.listaMaterias = listaMaterias;
    }

    // 1. VIEWHOLDER: mantiene las referencias a las vistas
    public static class MateriaViewHolder
            extends RecyclerView.ViewHolder {

        TextView txtNumero;
        TextView txtNombre;
        TextView txtDescripcion;

        public MateriaViewHolder(@NonNull View itemView) {
            super(itemView);

            txtNumero = itemView.findViewById(R.id.txtNumero);
            txtNombre = itemView.findViewById(R.id.txtNombre);
            txtDescripcion = itemView.findViewById(R.id.txtDescripcion);
        }
    }

    // 2. ADAPTER: crea las vistas de cada elemento
    @NonNull
    @Override
    public MateriaViewHolder onCreateViewHolder(
            @NonNull ViewGroup parent,
            int viewType) {

        View vista = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_materia, parent, false);

        return new MateriaViewHolder(vista);
    }

    // 3. ADAPTER: enlaza los datos con las vistas
    @Override
    public void onBindViewHolder(
            @NonNull MateriaViewHolder holder,
            int position) {

        Materia materia = listaMaterias.get(position);

        holder.txtNumero.setText(String.valueOf(materia.getNumero()));
        holder.txtNombre.setText(materia.getNombre());
        holder.txtDescripcion.setText(materia.getDescripcion());
    }

    // 4. Devuelve la cantidad de elementos
    @Override
    public int getItemCount() {
        return listaMaterias.size();
    }
}
