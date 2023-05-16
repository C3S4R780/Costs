import styles from "./Input.module.css"

function Input({type, label, name, placeholder, handleOnChange, value}) {
  return (
    <div className={styles.form_control}>
        <label htmlFor={name}>{label}:</label>
        <input
            type={type}
            name={name}
            id={name}
            defaultValue={value || ""}
            placeholder={placeholder}
            onChange={handleOnChange}
        />
    </div>
  )
}

export default Input