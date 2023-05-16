import styles from "./Select.module.css"

function Select({label, name, options, handleOnChange, value}) {
  return (
    <div className={styles.form_control}>
        <label htmlFor={name}>{label}:</label>
        <select name={name} id={name} value={value || ""} onChange={handleOnChange}>
            <option disabled value="">Selecione uma opção</option>
            {options.map((opt) => (
              <option key={opt.id} value={opt.id}>{opt.name}</option>
            ))}
        </select>
    </div>
  )
}

export default Select